import { supabase } from '../config/database.js';
import { socketManager } from '../app.js';
import notificationService from './notification.service.js';
import pointsService from './points.service.js';

class ActivityService {
  constructor() {
    this.categories = ['academic', 'sports', 'social', 'volunteer', 'career', 'cultural', 'technology'];
    this.types = ['individual', 'team', 'competition', 'workshop', 'seminar'];
    this.statuses = ['draft', 'published', 'ongoing', 'completed', 'cancelled'];
  }

  async createActivity(activityData) {
    try {
      const {
        title,
        description,
        category,
        type,
        organizerId,
        location,
        locationCoordinates,
        startTime,
        endTime,
        registrationDeadline,
        maxParticipants,
        entryFee = 0,
        entryFeePoints = 0,
        rewardPoints = 0,
        requirements,
        tags = [],
        imageUrls = [],
        contactInfo = {},
        locationVerification = false,
        autoComplete = false
      } = activityData;

      // Validate inputs
      if (!title || !description || !category || !type || !organizerId || !startTime || !endTime) {
        throw new Error('Missing required fields');
      }

      if (!this.categories.includes(category)) {
        throw new Error('Invalid category');
      }

      if (!this.types.includes(type)) {
        throw new Error('Invalid type');
      }

      // Validate time constraints
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
      const regDeadline = registrationDeadline ? new Date(registrationDeadline) : null;

      if (start <= now) {
        throw new Error('Activity start time must be in the future');
      }

      if (end <= start) {
        throw new Error('Activity end time must be after start time');
      }

      if (regDeadline && regDeadline >= start) {
        throw new Error('Registration deadline must be before activity start time');
      }

      // Check organizer permissions
      const { data: organizer, error: organizerError } = await supabase
        .from('users')
        .select('id, verification_status, is_active')
        .eq('id', organizerId)
        .single();

      if (organizerError || !organizer || !organizer.is_active || organizer.verification_status !== 'verified') {
        throw new Error('Invalid or unverified organizer');
      }

      // Check concurrent activities limit
      const { count: concurrentCount, error: countError } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_id', organizerId)
        .in('status', ['published', 'ongoing'])
        .gte('end_time', now.toISOString());

      if (countError) {
        throw countError;
      }

      if (concurrentCount >= 5) {
        throw new Error('Maximum 5 concurrent activities allowed per organizer');
      }

      // Generate checkin code
      const checkinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create activity
      const { data: activity, error: createError } = await supabase
        .from('activities')
        .insert({
          title,
          description,
          category,
          type,
          organizer_id: organizerId,
          location,
          location_coordinates: locationCoordinates,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          registration_deadline: regDeadline?.toISOString(),
          max_participants: maxParticipants,
          entry_fee: entryFee,
          entry_fee_points: entryFeePoints,
          reward_points: rewardPoints,
          requirements,
          tags,
          image_urls: imageUrls,
          contact_info: contactInfo,
          checkin_code: checkinCode,
          location_verification: locationVerification,
          auto_complete: autoComplete,
          status: 'draft'
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      console.log(`🎯 Activity created: ${activity.title} by user ${organizerId}`);

      return {
        success: true,
        activity
      };

    } catch (error) {
      console.error('❌ Failed to create activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getActivities(filters = {}) {
    try {
      const {
        limit = 20,
        offset = 0,
        category = null,
        type = null,
        status = 'published',
        organizerId = null,
        search = null,
        startDate = null,
        endDate = null,
        location = null,
        featured = null,
        sortBy = 'start_time',
        sortOrder = 'asc'
      } = filters;

      let query = supabase
        .from('activities')
        .select(`
          *,
          organizer:users!organizer_id(
            id,
            first_name,
            last_name,
            avatar_url,
            university
          ),
          participants:activity_participations(count)
        `);

      // Apply filters
      if (status) {
        if (Array.isArray(status)) {
          query = query.in('status', status);
        } else {
          query = query.eq('status', status);
        }
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (type) {
        query = query.eq('type', type);
      }

      if (organizerId) {
        query = query.eq('organizer_id', organizerId);
      }

      if (featured !== null) {
        query = query.eq('featured', featured);
      }

      if (startDate) {
        query = query.gte('start_time', startDate);
      }

      if (endDate) {
        query = query.lte('start_time', endDate);
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Apply sorting
      const validSortFields = ['start_time', 'created_at', 'title', 'current_participants', 'view_count'];
      if (validSortFields.includes(sortBy)) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('start_time', { ascending: true });
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data: activities, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        success: true,
        activities: activities || [],
        total: count,
        hasMore: (activities?.length || 0) === limit
      };

    } catch (error) {
      console.error('❌ Failed to get activities:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getActivityById(activityId, userId = null) {
    try {
      const { data: activity, error } = await supabase
        .from('activities')
        .select(`
          *,
          organizer:users!organizer_id(
            id,
            first_name,
            last_name,
            avatar_url,
            university,
            email,
            phone
          ),
          participants:activity_participations(
            id,
            user_id,
            registration_time,
            attendance_status,
            user:users(
              id,
              first_name,
              last_name,
              avatar_url,
              university
            )
          )
        `)
        .eq('id', activityId)
        .single();

      if (error) {
        throw error;
      }

      if (!activity) {
        throw new Error('Activity not found');
      }

      // Increment view count
      await supabase
        .from('activities')
        .update({ view_count: activity.view_count + 1 })
        .eq('id', activityId);

      // Check if user is registered (if userId provided)
      let userParticipation = null;
      if (userId) {
        const { data: participation } = await supabase
          .from('activity_participations')
          .select('*')
          .eq('activity_id', activityId)
          .eq('user_id', userId)
          .single();

        userParticipation = participation;
      }

      return {
        success: true,
        activity: {
          ...activity,
          user_participation: userParticipation
        }
      };

    } catch (error) {
      console.error('❌ Failed to get activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateActivity(activityId, updateData, organizerId) {
    try {
      // Check if activity exists and belongs to organizer
      const { data: existingActivity, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .eq('organizer_id', organizerId)
        .single();

      if (fetchError || !existingActivity) {
        throw new Error('Activity not found or access denied');
      }

      // Don't allow updating completed or cancelled activities
      if (['completed', 'cancelled'].includes(existingActivity.status)) {
        throw new Error('Cannot update completed or cancelled activities');
      }

      // Validate time constraints if updating times
      if (updateData.startTime || updateData.endTime) {
        const startTime = new Date(updateData.startTime || existingActivity.start_time);
        const endTime = new Date(updateData.endTime || existingActivity.end_time);
        const now = new Date();

        if (startTime <= now) {
          throw new Error('Activity start time must be in the future');
        }

        if (endTime <= startTime) {
          throw new Error('Activity end time must be after start time');
        }
      }

      // Update activity
      const { data: updatedActivity, error: updateError } = await supabase
        .from('activities')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', activityId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Notify participants if significant changes
      if (updateData.startTime || updateData.endTime || updateData.location) {
        await this.notifyParticipantsOfUpdate(activityId, updatedActivity);
      }

      console.log(`🎯 Activity updated: ${updatedActivity.title}`);

      return {
        success: true,
        activity: updatedActivity
      };

    } catch (error) {
      console.error('❌ Failed to update activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteActivity(activityId, organizerId) {
    try {
      // Check if activity exists and belongs to organizer
      const { data: activity, error: fetchError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .eq('organizer_id', organizerId)
        .single();

      if (fetchError || !activity) {
        throw new Error('Activity not found or access denied');
      }

      // Don't allow deleting ongoing or completed activities
      if (['ongoing', 'completed'].includes(activity.status)) {
        throw new Error('Cannot delete ongoing or completed activities');
      }

      // Delete activity (this will cascade delete participations)
      const { error: deleteError } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (deleteError) {
        throw deleteError;
      }

      // Notify participants of cancellation
      if (activity.status === 'published') {
        await this.notifyParticipantsOfCancellation(activityId, activity);
      }

      console.log(`🎯 Activity deleted: ${activity.title}`);

      return {
        success: true,
        message: 'Activity deleted successfully'
      };

    } catch (error) {
      console.error('❌ Failed to delete activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async publishActivity(activityId, organizerId) {
    try {
      const updateResult = await this.updateActivity(activityId, { status: 'published' }, organizerId);
      
      if (!updateResult.success) {
        return updateResult;
      }

      // Send notification to followers (if implemented)
      // await this.notifyFollowersOfNewActivity(updateResult.activity);

      console.log(`🎯 Activity published: ${updateResult.activity.title}`);

      return updateResult;

    } catch (error) {
      console.error('❌ Failed to publish activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async searchActivities(searchParams) {
    try {
      const {
        query,
        category,
        location,
        startDate,
        endDate,
        maxDistance = null,
        userLocation = null,
        limit = 20,
        offset = 0
      } = searchParams;

      let searchQuery = supabase
        .from('activities')
        .select(`
          *,
          organizer:users!organizer_id(
            id,
            first_name,
            last_name,
            avatar_url,
            university
          )
        `)
        .eq('status', 'published');

      // Text search
      if (query) {
        searchQuery = searchQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
      }

      // Category filter
      if (category) {
        searchQuery = searchQuery.eq('category', category);
      }

      // Location filter
      if (location) {
        searchQuery = searchQuery.ilike('location', `%${location}%`);
      }

      // Date range filter
      if (startDate) {
        searchQuery = searchQuery.gte('start_time', startDate);
      }

      if (endDate) {
        searchQuery = searchQuery.lte('start_time', endDate);
      }

      // Apply pagination
      searchQuery = searchQuery
        .order('start_time', { ascending: true })
        .range(offset, offset + limit - 1);

      const { data: activities, error } = await searchQuery;

      if (error) {
        throw error;
      }

      // TODO: Implement geographical distance filtering if userLocation and maxDistance provided
      let filteredActivities = activities || [];

      return {
        success: true,
        activities: filteredActivities,
        total: filteredActivities.length,
        hasMore: filteredActivities.length === limit
      };

    } catch (error) {
      console.error('❌ Failed to search activities:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getMyActivities(userId, type = 'organized') {
    try {
      if (type === 'organized') {
        return await this.getActivities({
          organizerId: userId,
          status: ['draft', 'published', 'ongoing', 'completed'],
          sortBy: 'created_at',
          sortOrder: 'desc'
        });
      } else if (type === 'registered') {
        const { data: participations, error } = await supabase
          .from('activity_participations')
          .select(`
            *,
            activity:activities(
              *,
              organizer:users!organizer_id(
                id,
                first_name,
                last_name,
                avatar_url,
                university
              )
            )
          `)
          .eq('user_id', userId)
          .order('registration_time', { ascending: false });

        if (error) {
          throw error;
        }

        return {
          success: true,
          activities: participations?.map(p => ({
            ...p.activity,
            participation: {
              id: p.id,
              registration_time: p.registration_time,
              attendance_status: p.attendance_status,
              checkin_time: p.checkin_time,
              points_earned: p.points_earned
            }
          })) || []
        };
      }

    } catch (error) {
      console.error('❌ Failed to get my activities:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Activity registration methods
  async registerForActivity(activityId, userId) {
    try {
      // Get activity details
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (activityError || !activity) {
        throw new Error('Activity not found');
      }

      // Check if activity is published and not cancelled
      if (activity.status !== 'published') {
        throw new Error('Activity is not available for registration');
      }

      // Check registration deadline
      const now = new Date();
      const regDeadline = activity.registration_deadline ? new Date(activity.registration_deadline) : new Date(activity.start_time);
      
      if (now > regDeadline) {
        throw new Error('Registration deadline has passed');
      }

      // Check if user already registered
      const { data: existingRegistration, error: checkError } = await supabase
        .from('activity_participations')
        .select('id')
        .eq('activity_id', activityId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingRegistration) {
        throw new Error('Already registered for this activity');
      }

      // Check if activity is full
      if (activity.max_participants && activity.current_participants >= activity.max_participants) {
        throw new Error('Activity is full');
      }

      // Check if user has enough points for entry fee
      if (activity.entry_fee_points > 0) {
        const { data: user } = await supabase
          .from('users')
          .select('points')
          .eq('id', userId)
          .single();

        if (!user || user.points < activity.entry_fee_points) {
          throw new Error('Insufficient points for registration');
        }

        // Deduct points
        await pointsService.deductPoints(userId, activity.entry_fee_points, 'activity_registration', {
          activityId,
          activityTitle: activity.title
        });
      }

      // Register user
      const { data: participation, error: registrationError } = await supabase
        .from('activity_participations')
        .insert({
          activity_id: activityId,
          user_id: userId,
          attendance_status: 'registered',
          payment_status: activity.entry_fee > 0 ? 'pending' : 'paid'
        })
        .select()
        .single();

      if (registrationError) {
        throw registrationError;
      }

      // Send confirmation notification
      await notificationService.sendNotification(userId, {
        type: 'activity_registered',
        title: '活动报名成功',
        data: {
          activityId,
          activityTitle: activity.title,
          startTime: activity.start_time,
          location: activity.location
        }
      });

      // Notify organizer
      await notificationService.sendNotification(activity.organizer_id, {
        type: 'activity_new_registration',
        title: '新的活动报名',
        data: {
          activityId,
          activityTitle: activity.title,
          participantCount: activity.current_participants + 1
        }
      });

      console.log(`🎯 User ${userId} registered for activity ${activity.title}`);

      return {
        success: true,
        participation
      };

    } catch (error) {
      console.error('❌ Failed to register for activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cancelRegistration(activityId, userId) {
    try {
      // Get participation record
      const { data: participation, error: participationError } = await supabase
        .from('activity_participations')
        .select('*')
        .eq('activity_id', activityId)
        .eq('user_id', userId)
        .single();

      if (participationError || !participation) {
        throw new Error('Registration not found');
      }

      // Get activity details
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (activityError || !activity) {
        throw new Error('Activity not found');
      }

      // Check if cancellation is allowed
      const now = new Date();
      const startTime = new Date(activity.start_time);
      const hoursUntilStart = (startTime - now) / (1000 * 60 * 60);

      if (hoursUntilStart < 24) {
        throw new Error('Cannot cancel registration less than 24 hours before activity starts');
      }

      if (participation.attendance_status === 'attended') {
        throw new Error('Cannot cancel registration after attending');
      }

      // Delete participation record
      const { error: deleteError } = await supabase
        .from('activity_participations')
        .delete()
        .eq('id', participation.id);

      if (deleteError) {
        throw deleteError;
      }

      // Refund points if applicable
      if (activity.entry_fee_points > 0) {
        await pointsService.awardPoints(userId, activity.entry_fee_points, 'activity_registration_refund', {
          activityId,
          activityTitle: activity.title
        });
      }

      // Send cancellation notification
      await notificationService.sendNotification(userId, {
        type: 'activity_registration_cancelled',
        title: '活动报名已取消',
        data: {
          activityId,
          activityTitle: activity.title
        }
      });

      console.log(`🎯 User ${userId} cancelled registration for activity ${activity.title}`);

      return {
        success: true,
        message: 'Registration cancelled successfully'
      };

    } catch (error) {
      console.error('❌ Failed to cancel registration:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async checkInToActivity(activityId, userId, checkinData = {}) {
    try {
      const { checkinCode, location } = checkinData;

      // Get participation record
      const { data: participation, error: participationError } = await supabase
        .from('activity_participations')
        .select('*')
        .eq('activity_id', activityId)
        .eq('user_id', userId)
        .single();

      if (participationError || !participation) {
        throw new Error('You are not registered for this activity');
      }

      if (participation.attendance_status === 'attended') {
        throw new Error('Already checked in to this activity');
      }

      // Get activity details
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();

      if (activityError || !activity) {
        throw new Error('Activity not found');
      }

      // Verify checkin code if required
      if (checkinCode && activity.checkin_code !== checkinCode.toUpperCase()) {
        throw new Error('Invalid checkin code');
      }

      // Check time constraints
      const now = new Date();
      const startTime = new Date(activity.start_time);
      const endTime = new Date(activity.end_time);

      // Allow checkin 30 minutes before start and until activity ends
      const checkinWindow = 30 * 60 * 1000; // 30 minutes in milliseconds
      const earliestCheckin = new Date(startTime.getTime() - checkinWindow);

      if (now < earliestCheckin) {
        throw new Error('Check-in is not yet available');
      }

      if (now > endTime) {
        throw new Error('Check-in window has closed');
      }

      // Update participation record
      const updateData = {
        attendance_status: 'attended',
        checkin_time: now.toISOString()
      };

      if (location) {
        updateData.checkin_location = location;
      }

      const { data: updatedParticipation, error: updateError } = await supabase
        .from('activity_participations')
        .update(updateData)
        .eq('id', participation.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Award points for participation
      let pointsEarned = 0;
      if (activity.reward_points > 0) {
        const awardResult = await pointsService.awardPoints(userId, activity.reward_points, 'activity_participation', {
          activityId,
          activityTitle: activity.title
        });

        if (awardResult.success) {
          pointsEarned = activity.reward_points;
          
          // Update participation record with points earned
          await supabase
            .from('activity_participations')
            .update({ points_earned: pointsEarned })
            .eq('id', participation.id);
        }
      }

      // Send checkin notification
      await notificationService.sendNotification(userId, {
        type: 'activity_checkin_success',
        title: '签到成功',
        data: {
          activityId,
          activityTitle: activity.title,
          pointsEarned
        }
      });

      console.log(`🎯 User ${userId} checked in to activity ${activity.title}`);

      return {
        success: true,
        participation: {
          ...updatedParticipation,
          points_earned: pointsEarned
        },
        pointsEarned
      };

    } catch (error) {
      console.error('❌ Failed to check in to activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getActivityParticipants(activityId, organizerId = null) {
    try {
      // If organizerId is provided, verify ownership
      if (organizerId) {
        const { data: activity } = await supabase
          .from('activities')
          .select('organizer_id')
          .eq('id', activityId)
          .single();

        if (!activity || activity.organizer_id !== organizerId) {
          throw new Error('Activity not found or access denied');
        }
      }

      const { data: participants, error } = await supabase
        .from('activity_participations')
        .select(`
          *,
          user:users(
            id,
            first_name,
            last_name,
            avatar_url,
            university,
            email
          )
        `)
        .eq('activity_id', activityId)
        .order('registration_time', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        success: true,
        participants: participants || []
      };

    } catch (error) {
      console.error('❌ Failed to get activity participants:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper methods for notifications
  async notifyParticipantsOfUpdate(activityId, activity) {
    try {
      const { data: participants } = await supabase
        .from('activity_participations')
        .select('user_id')
        .eq('activity_id', activityId)
        .eq('attendance_status', 'registered');

      if (participants && participants.length > 0) {
        const userIds = participants.map(p => p.user_id);
        
        await notificationService.sendBatchNotification(userIds, {
          type: 'activity_updated',
          title: '活动信息更新',
          data: {
            activityId,
            activityTitle: activity.title,
            startTime: activity.start_time,
            location: activity.location
          }
        });
      }
    } catch (error) {
      console.error('Failed to notify participants of update:', error);
    }
  }

  async notifyParticipantsOfCancellation(activityId, activity) {
    try {
      const { data: participants } = await supabase
        .from('activity_participations')
        .select('user_id')
        .eq('activity_id', activityId);

      if (participants && participants.length > 0) {
        const userIds = participants.map(p => p.user_id);
        
        await notificationService.sendBatchNotification(userIds, {
          type: 'activity_cancelled',
          title: '活动已取消',
          data: {
            activityId,
            activityTitle: activity.title
          }
        });
      }
    } catch (error) {
      console.error('Failed to notify participants of cancellation:', error);
    }
  }
}

// Create singleton instance
const activityService = new ActivityService();

export default activityService;
import { supabase } from './supabase';
import { KeywordResponse, WidgetSettings, ChatSession, Message } from '../types';

// Widget Settings API
export async function getWidgetSettings(userId: string): Promise<WidgetSettings | null> {
  try {
    const { data, error } = await supabase
      .from('widget_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, create default settings
        const defaultSettings: Omit<WidgetSettings, 'id' | 'created_at' | 'updated_at'> = {
          user_id: userId,
          business_name: 'My Business',
          primary_color: '#4F46E5',
          secondary_color: '#EEF2FF',
          position: 'bottom-right',
          icon: 'message-circle',
          welcome_message: 'Hello! How can I help you today?',
          is_active: true,
          auto_open: false,
          open_delay: 3,
          hide_on_mobile: false
        };
        
        const { data: newSettings, error: createError } = await supabase
          .from('widget_settings')
          .insert([defaultSettings])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating default widget settings:', createError);
          return null;
        }
        
        return newSettings as WidgetSettings;
      }
      
      console.error('Error fetching widget settings:', error);
      return null;
    }
    
    return data as WidgetSettings;
  } catch (error) {
    console.error('Unexpected error fetching widget settings:', error);
    return null;
  }
}

export async function updateWidgetSettings(settings: Partial<WidgetSettings>): Promise<WidgetSettings | null> {
  try {
    // Check if settings exist
    if (!settings.id) {
      // Create new settings
      const { data: newSettings, error: createError } = await supabase
        .from('widget_settings')
        .insert([settings])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating widget settings:', createError);
        return null;
      }
      
      return newSettings as WidgetSettings;
    }
    
    // Update existing settings
    const { data, error } = await supabase
      .from('widget_settings')
      .update(settings)
      .eq('id', settings.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating widget settings:', error);
      return null;
    }
    
    return data as WidgetSettings;
  } catch (error) {
    console.error('Unexpected error updating widget settings:', error);
    return null;
  }
}

// Keyword Responses API
export async function getKeywordResponses(userId: string): Promise<KeywordResponse[]> {
  try {
    const { data, error } = await supabase
      .from('keyword_responses')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: false });
    
    if (error) {
      console.error('Error fetching keyword responses:', error);
      return [];
    }
    
    return data as KeywordResponse[];
  } catch (error) {
    console.error('Unexpected error fetching keyword responses:', error);
    return [];
  }
}

export async function createKeywordResponse(response: Omit<KeywordResponse, 'id' | 'created_at' | 'updated_at'>): Promise<KeywordResponse | null> {
  try {
    const { data, error } = await supabase
      .from('keyword_responses')
      .insert(response)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating keyword response:', error);
      return null;
    }
    
    return data as KeywordResponse;
  } catch (error) {
    console.error('Unexpected error creating keyword response:', error);
    return null;
  }
}

export async function updateKeywordResponse(response: Partial<KeywordResponse>): Promise<KeywordResponse | null> {
  try {
    const { data, error } = await supabase
      .from('keyword_responses')
      .update(response)
      .eq('id', response.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating keyword response:', error);
      return null;
    }
    
    return data as KeywordResponse;
  } catch (error) {
    console.error('Unexpected error updating keyword response:', error);
    return null;
  }
}

export async function deleteKeywordResponse(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('keyword_responses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting keyword response:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting keyword response:', error);
    return false;
  }
}

// Chat History API
export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching chat sessions:', error);
      return [];
    }
    
    return data as ChatSession[];
  } catch (error) {
    console.error('Unexpected error fetching chat sessions:', error);
    return [];
  }
}

export async function getChatSessionMessages(sessionId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching chat session messages:', error);
      return [];
    }
    
    return data as Message[];
  } catch (error) {
    console.error('Unexpected error fetching chat session messages:', error);
    return [];
  }
}

export async function updateChatSession(session: Partial<ChatSession>): Promise<ChatSession | null> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update(session)
      .eq('id', session.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating chat session:', error);
      return null;
    }
    
    return data as ChatSession;
  } catch (error) {
    console.error('Unexpected error updating chat session:', error);
    return null;
  }
}

// Create a new chat session
export async function createChatSession(session: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>): Promise<ChatSession | null> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
    
    return data as ChatSession;
  } catch (error) {
    console.error('Unexpected error creating chat session:', error);
    return null;
  }
}

// Create a new message
export async function createMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating message:', error);
      return null;
    }
    
    return data as Message;
  } catch (error) {
    console.error('Unexpected error creating message:', error);
    return null;
  }
}

// Get active chat sessions
export async function getActiveChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'agent_assigned'])
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching active chat sessions:', error);
      return [];
    }
    
    return data as ChatSession[];
  } catch (error) {
    console.error('Unexpected error fetching active chat sessions:', error);
    return [];
  }
}

// Get analytics data
export async function getAnalyticsData(userId: string, timeRange: string = '7d') {
  try {
    // Get total chats
    const { data: chatData, error: chatError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('user_id', userId);
    
    if (chatError) throw chatError;
    
    // Get total messages
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .select('id, chat_session_id, chat_sessions!inner(user_id)')
      .eq('chat_sessions.user_id', userId);
    
    if (messageError) throw messageError;
    
    // For a real implementation, we would calculate more metrics
    // For now, we'll return some basic stats
    return {
      total_chats: chatData?.length || 0,
      total_messages: messageData?.length || 0,
      average_response_time: 8.5, // Mock data
      chat_duration: 4.2, // Mock data
      visitor_satisfaction: 92, // Mock data
      keyword_matches: {
        'pricing': 42,
        'support': 38,
        'features': 27,
        'account': 21,
        'billing': 18,
        'other': 34
      }
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      total_chats: 0,
      total_messages: 0,
      average_response_time: 0,
      chat_duration: 0,
      visitor_satisfaction: 0,
      keyword_matches: {}
    };
  }
}

// Widget Data API for public access
export async function getWidgetData(uid: string) {
  try {
    // Get widget settings
    const { data: settings, error: settingsError } = await supabase
      .from('widget_settings')
      .select('*')
      .eq('user_id', uid)
      .single();
    
    if (settingsError) throw settingsError;
    
    // Get keyword responses
    const { data: keywordResponses, error: keywordError } = await supabase
      .from('keyword_responses')
      .select('*')
      .eq('user_id', uid)
      .eq('is_active', true)
      .order('priority', { ascending: false });
    
    if (keywordError) throw keywordError;
    
    return {
      settings,
      keywordResponses
    };
  } catch (error) {
    console.error('Error fetching widget data:', error);
    return {
      settings: null,
      keywordResponses: []
    };
  }
}
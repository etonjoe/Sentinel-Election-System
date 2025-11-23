import React, { useState } from 'react';
import { ChatMessage, BroadcastMessage } from '../types';
import { INITIAL_CHAT, BROADCAST_HISTORY } from '../constants';
import { Send, Users, CheckCheck, Plus, Megaphone, Smartphone, Mail, Bell, User, MoreVertical, Search, X, UserPlus } from 'lucide-react';

// Local types for the Chat UI
interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group';
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatarColor: string;
  members: string[]; // Names of people in the chat
}

// Mock Contacts for creating groups
const AVAILABLE_CONTACTS = [
  { id: 'c1', name: 'Sarah Jenkins', role: 'Field Agent' },
  { id: 'c2', name: 'Mike Ross', role: 'Logistics' },
  { id: 'c3', name: 'John Doe', role: 'Security' },
  { id: 'c4', name: 'Jane Smith', role: 'Analyst' },
  { id: 'c5', name: 'Dr. A. Bellows', role: 'Observer' },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: 'chat-1', name: 'Field Ops: North', type: 'group', lastMessage: 'Agent Sarah: Sending photo now.', timestamp: '12:30', unread: 2, avatarColor: 'bg-indigo-100 text-indigo-600', members: ['Sarah', 'Mike', 'You'] },
  { id: 'chat-2', name: 'Logistics Team', type: 'group', lastMessage: 'All materials deployed.', timestamp: 'Yesterday', unread: 0, avatarColor: 'bg-orange-100 text-orange-600', members: ['Mike', 'John', 'You'] },
  { id: 'chat-3', name: 'Sarah Jenkins', type: 'direct', lastMessage: 'Can you approve the upload?', timestamp: '10:45', unread: 1, avatarColor: 'bg-blue-100 text-blue-600', members: ['Sarah', 'You'] },
  { id: 'chat-4', name: 'John Doe', type: 'direct', lastMessage: 'Security perimeter secure.', timestamp: '09:15', unread: 0, avatarColor: 'bg-slate-100 text-slate-600', members: ['John', 'You'] },
];

const Communication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'broadcast'>('chat');
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  
  // Chat State
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
      'chat-1': INITIAL_CHAT,
      'chat-2': [],
      'chat-3': [],
      'chat-4': []
  });
  const [inputText, setInputText] = useState('');

  // Group Creation State
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const activeConversation = conversations.find(c => c.id === activeChatId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Me',
      text: inputText,
      timestamp: new Date(),
      isMe: true
    };

    setMessages(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newMsg]
    }));

    // Update last message in conversation list
    setConversations(prev => prev.map(c => 
        c.id === activeChatId 
        ? { ...c, lastMessage: `Me: ${inputText}`, timestamp: 'Just now' } 
        : c
    ));

    setInputText('');
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedContacts.length === 0) return;

    const newGroup: Conversation = {
        id: `chat-${Date.now()}`,
        name: newGroupName,
        type: 'group',
        lastMessage: 'Group created',
        timestamp: 'Just now',
        unread: 0,
        avatarColor: 'bg-purple-100 text-purple-600',
        members: [...selectedContacts.map(id => AVAILABLE_CONTACTS.find(c => c.id === id)?.name || ''), 'You']
    };

    setConversations([newGroup, ...conversations]);
    setMessages(prev => ({ ...prev, [newGroup.id]: [] }));
    setActiveChatId(newGroup.id);
    
    // Reset & Close
    setNewGroupName('');
    setSelectedContacts([]);
    setShowCreateGroup(false);
  };

  const toggleContactSelection = (id: string) => {
    if (selectedContacts.includes(id)) {
        setSelectedContacts(prev => prev.filter(c => c !== id));
    } else {
        setSelectedContacts(prev => [...prev, id]);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 relative">
      {/* Sidebar for contact/channels */}
      <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
            <div className="flex p-1 bg-slate-100 rounded-lg">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'chat' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                >
                    Chats
                </button>
                <button 
                    onClick={() => setActiveTab('broadcast')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'broadcast' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                >
                    Broadcasts
                </button>
            </div>
        </div>

        {activeTab === 'chat' ? (
            <div className="flex-1 overflow-y-auto flex flex-col">
                 <div className="p-3 border-b border-slate-50">
                    <button 
                        onClick={() => setShowCreateGroup(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Plus size={16} /> Create New Group
                    </button>
                 </div>
                 
                 <div className="p-2 space-y-1">
                    {conversations.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChatId(chat.id)}
                            className={`p-3 rounded-lg cursor-pointer border transition-all ${
                                activeChatId === chat.id 
                                ? 'bg-blue-50 border-blue-100 shadow-sm' 
                                : 'bg-white border-transparent hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`w-10 h-10 min-w-[2.5rem] rounded-full flex items-center justify-center font-bold text-sm ${chat.avatarColor}`}>
                                        {chat.type === 'group' ? <Users size={18} /> : <User size={18} />}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className={`font-semibold text-sm truncate ${activeChatId === chat.id ? 'text-blue-900' : 'text-slate-800'}`}>
                                            {chat.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">{chat.lastMessage}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-slate-400">{chat.timestamp}</span>
                                    {chat.unread > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                    <Megaphone size={18} />
                    <span className="text-sm font-medium">Emergency Broadcast</span>
                </button>
                <h4 className="px-2 mt-4 text-xs font-bold text-slate-400 uppercase">Sent History</h4>
                {BROADCAST_HISTORY.map(bc => (
                    <div key={bc.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <h5 className="text-sm font-medium text-slate-800">{bc.title}</h5>
                        <div className="flex gap-2 mt-2 text-slate-400">
                            {bc.channels.includes('sms') && <Smartphone size={14} />}
                            {bc.channels.includes('push') && <Bell size={14} />}
                            {bc.channels.includes('email') && <Mail size={14} />}
                            <span className="text-xs ml-auto">{bc.sentAt}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        {activeTab === 'chat' ? (
            <>
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${activeConversation.avatarColor}`}>
                            {activeConversation.type === 'group' ? <Users size={20} /> : <User size={20} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{activeConversation.name}</h3>
                            {activeConversation.type === 'group' ? (
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    {activeConversation.members.length} members • {activeConversation.members.join(', ')}
                                </p>
                            ) : (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                </p>
                            )}
                        </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                    {(messages[activeChatId] || []).length > 0 ? (
                        (messages[activeChatId] || []).map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                    {!msg.isMe && activeConversation.type === 'group' && (
                                        <span className="text-xs text-slate-500 mb-1 ml-1">{msg.sender}</span>
                                    )}
                                    <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                                        msg.isMe 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[10px] text-slate-400">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        {msg.isMe && <CheckCheck size={12} className="text-blue-500" />}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                {activeConversation.type === 'group' ? <Users size={32} /> : <User size={32} />}
                            </div>
                            <p className="text-sm">No messages yet. Start the conversation!</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={`Message ${activeConversation.name}...`}
                            className="flex-1 px-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg text-sm outline-none transition-all"
                        />
                        <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Megaphone size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Broadcast Center</h3>
                <p className="text-slate-500 max-w-md mb-8">Send alerts via SMS, Push Notification, and Email to all field agents instantly.</p>
                
                <div className="w-full max-w-lg bg-slate-50 p-6 rounded-xl border border-slate-200 text-left">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input type="text" className="w-full mb-4 p-2 border rounded-lg" placeholder="Emergency Alert" />
                    
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message Body</label>
                    <textarea className="w-full mb-4 p-2 border rounded-lg h-24" placeholder="Type your broadcast message..."></textarea>
                    
                    <div className="flex gap-4 mb-6">
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" defaultChecked className="rounded text-blue-600" /> Push
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" className="rounded text-blue-600" /> SMS
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" className="rounded text-blue-600" /> Email
                        </label>
                    </div>
                    
                    <button className="w-full py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors">
                        Send Broadcast
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-xl">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Create New Group</h3>
                    <button onClick={() => setShowCreateGroup(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Group Name</label>
                        <input 
                            type="text" 
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="e.g., East District Ops" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Select Members</label>
                        <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-slate-50">
                            {AVAILABLE_CONTACTS.map(contact => (
                                <div 
                                    key={contact.id} 
                                    onClick={() => toggleContactSelection(contact.id)}
                                    className={`p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${
                                        selectedContacts.includes(contact.id) ? 'bg-blue-50/50' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-xs font-bold">
                                            {contact.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{contact.name}</p>
                                            <p className="text-xs text-slate-500">{contact.role}</p>
                                        </div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                        selectedContacts.includes(contact.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                                    }`}>
                                        {selectedContacts.includes(contact.id) && <CheckCheck size={12} className="text-white" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-right">
                            {selectedContacts.length} members selected
                        </p>
                    </div>

                    <button 
                        onClick={handleCreateGroup}
                        disabled={!newGroupName || selectedContacts.length === 0}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <UserPlus size={18} /> Create Group
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
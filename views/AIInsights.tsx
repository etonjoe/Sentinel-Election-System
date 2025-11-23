import React, { useState, useEffect } from 'react';
import { PollingUnitResult, AnomalyReport } from '../types';
import { analyzeAnomalies, generateExecutiveSummary, askChatbot } from '../services/geminiService';
import { Sparkles, FileText, AlertTriangle, RefreshCw, MessageSquare, Send, Bot, Printer, Download } from 'lucide-react';

interface AIInsightsProps {
  results: PollingUnitResult[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ results }) => {
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);
  
  const [report, setReport] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([
      {role: 'system', text: 'Hello! I am the Sentinel AI Assistant. I can help you analyze voting patterns or answer legal/logistic questions.'}
  ]);
  const [loadingChat, setLoadingChat] = useState(false);

  const runAnalysis = async () => {
    setLoadingAnomalies(true);
    const report = await analyzeAnomalies(results);
    setAnomalies(report);
    setLoadingAnomalies(false);
  };

  const runReport = async () => {
      setLoadingReport(true);
      // Quick mock summary stats for the report
      const stats = {
          totalUnits: results.length,
          totalVotes: results.reduce((a,b) => a + b.accreditedVoters, 0),
          flaggedUnits: results.filter(r => r.status === 'flagged').length
      };
      const incidents = anomalies.slice(0, 5);
      const text = await generateExecutiveSummary(stats, incidents);
      setReport(text);
      setLoadingReport(false);
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!chatInput.trim()) return;

      const newMessage = { role: 'user', text: chatInput };
      setChatHistory(prev => [...prev, newMessage]);
      setChatInput('');
      setLoadingChat(true);

      const response = await askChatbot(chatHistory, newMessage.text);
      setChatHistory(prev => [...prev, { role: 'system', text: response }]);
      setLoadingChat(false);
  }

  const handleExport = (type: 'pdf' | 'word') => {
      if (!report) return;

      if (type === 'word') {
          // Simple HTML to Doc export simulation
          const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Executive Summary</title></head><body>";
          const footer = "</body></html>";
          // Simple conversion of newlines to breaks for the HTML view
          const sourceHTML = header + `<div style="font-family: Arial; line-height: 1.5;">${report.replace(/\n/g, '<br/>')}</div>` + footer;
          
          const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
          const fileDownload = document.createElement("a");
          document.body.appendChild(fileDownload);
          fileDownload.href = source;
          fileDownload.download = `executive_summary_${new Date().toISOString().split('T')[0]}.doc`;
          fileDownload.click();
          document.body.removeChild(fileDownload);
      } else {
          // For PDF, we use the browser's native print functionality which supports "Save as PDF"
          const printWindow = window.open('', '', 'height=600,width=800');
          if (printWindow) {
              printWindow.document.write('<html><head><title>Executive Summary</title>');
              printWindow.document.write('</head><body style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">');
              printWindow.document.write(`<div style="white-space: pre-wrap;">${report}</div>`);
              printWindow.document.write('</body></html>');
              printWindow.document.close();
              printWindow.print();
          }
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Left Column: Anomaly Detection */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Anomaly Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[400px]">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={20} />
                        <h3 className="font-bold text-slate-800">AI Anomaly Detection</h3>
                    </div>
                    <button 
                        onClick={runAnalysis}
                        disabled={loadingAnomalies}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        {loadingAnomalies ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                        Run Analysis
                    </button>
                </div>
                
                <div className="p-5 overflow-y-auto flex-1">
                    {loadingAnomalies ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p>Analyzing voting patterns across {results.length} units...</p>
                        </div>
                    ) : anomalies.length > 0 ? (
                        <div className="space-y-4">
                            {anomalies.map((anom, idx) => (
                                <div key={idx} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-red-900 text-sm">{anom.unitName} ({anom.unitId})</h4>
                                        <span className="text-xs font-bold uppercase text-red-600 tracking-wider">{anom.severity} Risk</span>
                                    </div>
                                    <p className="text-sm text-red-800 mt-1">{anom.description}</p>
                                    <div className="mt-2 text-xs text-red-700 bg-red-100/50 p-2 rounded">
                                        <strong>Recommendation:</strong> {anom.recommendation}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Sparkles size={48} className="mb-4 opacity-20" />
                            <p>Click "Run Analysis" to identify potential irregularities.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Generation Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[400px] flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FileText className="text-blue-500" size={20} />
                        <h3 className="font-bold text-slate-800">Executive Summary</h3>
                    </div>
                    <div className="flex gap-2">
                        {report && (
                            <>
                                <button 
                                    onClick={() => handleExport('word')}
                                    className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Export to Word"
                                >
                                    <FileText size={18} />
                                </button>
                                <button 
                                    onClick={() => handleExport('pdf')}
                                    className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Export to PDF"
                                >
                                    <Printer size={18} />
                                </button>
                            </>
                        )}
                        <button 
                             onClick={runReport}
                             disabled={loadingReport}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                             {loadingReport ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            Generate
                        </button>
                    </div>
                </div>
                <div className="p-5 overflow-y-auto flex-1 bg-slate-50">
                    {report ? (
                        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap font-mono text-xs">
                            {report}
                        </div>
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <p>Generate a professional report based on current data.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Chat Assistant */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-900 text-white rounded-t-xl flex items-center gap-3">
                <Bot size={20} className="text-blue-400" />
                <div>
                    <h3 className="font-bold text-sm">Sentinel Assistant</h3>
                    <p className="text-xs text-slate-400">Powered by Gemini</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loadingChat && (
                     <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                     </div>
                )}
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-200 bg-white rounded-b-xl">
                <div className="relative">
                    <input 
                        type="text" 
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-lg text-sm outline-none transition-all"
                        placeholder="Ask about electoral laws..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1">
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AIInsights;
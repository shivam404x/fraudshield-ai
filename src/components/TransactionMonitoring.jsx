import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Sliders,
  DollarSign,
  Tag,
  Clock,
  Sparkles,
  CreditCard,
  User,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function TransactionMonitoring({ onInspectTransaction, onNotify }) {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total_pages: 1, total_items: 0 });
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [riskTier, setRiskTier] = useState('all');
  const [status, setStatus] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [page, setPage] = useState(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.getTransactions({
        search,
        risk_tier: riskTier,
        status,
        min_amount: minAmount,
        max_amount: maxAmount,
        page,
        limit: 15
      });
      setTransactions(res.items || []);
      setPagination(res.pagination || { page: 1, limit: 15, total_pages: 1, total_items: 0 });
    } catch (err) {
      console.error('Failed to load transactions:', err);
      if (onNotify) onNotify('Failed to fetch transactions from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, riskTier, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setRiskTier('all');
    setStatus('all');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
  };

  const handleQuickStatusChange = async (txId, newStatus) => {
    try {
      await api.updateStatus(txId, newStatus, `Quick triage action: Marked as ${newStatus}`);
      if (onNotify) onNotify(`Transaction ${txId} marked as ${newStatus}`, 'success');
      fetchTransactions();
    } catch (err) {
      if (onNotify) onNotify(`Failed to update status: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Live Transaction Monitoring Ledger
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              AUDIT COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time feed of e-commerce checkout events, forensic ML attribution, and human analyst investigation.
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter and Search Bar (Clean White Fintech Card) */}
      <div className="fintech-card rounded-2xl p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, customer, email, card, merchant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Risk Tier Filter */}
          <div>
            <select
              value={riskTier}
              onChange={(e) => { setRiskTier(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition font-medium"
            >
              <option value="all">All Risk Tiers</option>
              <option value="Low Risk">Low Risk (0–34)</option>
              <option value="Medium Risk">Medium Risk (35–74)</option>
              <option value="High Risk">High Risk (75–100)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition font-medium"
            >
              <option value="all">All Review Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Escalated">Escalated</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Price Range Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span className="flex items-center space-x-1 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>Amount Filter:</span>
          </span>
          <input
            type="number"
            placeholder="Min $"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-24 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max $"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-24 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            type="button"
            onClick={() => { setPage(1); fetchTransactions(); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            Filter Amount
          </button>
          <div className="ml-auto flex items-center space-x-2">
            <span className="text-[11px] text-slate-500 font-medium">
              Showing {transactions.length} of {pagination.total_items} records
            </span>
          </div>
        </div>
      </div>

      {/* Main Transactions Table (Clean White Fintech Style) */}
      <div className="fintech-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3.5 px-4">Transaction ID & Source</th>
                <th className="py-3.5 px-4">Customer & Card</th>
                <th className="py-3.5 px-4">Category & Merchant</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Risk Tier & Factors</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-sans">
                    <div className="inline-flex items-center space-x-2">
                      <RotateCcw className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="font-medium text-slate-600">Loading transaction ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-sans">
                    No transactions match your current search criteria.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isHigh = tx.risk_tier === 'High Risk';
                  const isMed = tx.risk_tier === 'Medium Risk';
                  const dateStr = new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* ID & Source */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-blue-600">{tx.id}</div>
                        <div className="flex items-center space-x-1.5 mt-0.5 font-sans">
                          <span className="text-[10px] text-slate-500">{dateStr}</span>
                          {tx.is_simulated ? (
                            <span 
                              title="Generated by test simulation stream. Not real production activity."
                              className="px-1.5 py-0.5 rounded text-[9px] bg-amber-50 text-amber-800 border border-amber-300 font-bold"
                            >
                              🧪 SIMULATED
                            </span>
                          ) : (
                            <span 
                              title="Authentic IEEE-CIS benchmark dataset record evaluated by ML model."
                              className="px-1.5 py-0.5 rounded text-[9px] bg-blue-50 text-blue-800 border border-blue-200 font-bold"
                            >
                              📁 IEEE-CIS DATASET
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Customer & Card */}
                      <td className="py-3 px-4 font-sans">
                        <div className="font-semibold text-slate-900">{tx.customer_name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {tx.card_type} •••• {tx.card_last4}
                        </div>
                      </td>

                      {/* Category & Merchant */}
                      <td className="py-3 px-4 font-sans">
                        <div className="text-slate-900 capitalize font-medium">{tx.merchant_name}</div>
                        <div className="text-[11px] text-slate-500 capitalize">
                          {tx.merchant_category?.replace('_', ' ')}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                        ${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                            isHigh ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            isMed ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {tx.risk_score}
                          </span>
                          <span className="text-[11px] text-slate-400 font-sans">/ 100</span>
                        </div>
                      </td>

                      {/* Risk Tier & Factors */}
                      <td className="py-3 px-4 font-sans max-w-xs">
                        <div className={`text-xs font-bold ${
                          isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {tx.risk_tier}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {tx.top_risk_factors?.length > 0 
                            ? tx.top_risk_factors[0].title 
                            : 'Normal shopper behavior'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          tx.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          tx.status === 'Escalated' ? 'bg-violet-50 text-violet-800 border border-violet-200' :
                          tx.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                          'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {tx.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right font-sans">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => onInspectTransaction(tx)}
                            title="Inspect forensic report"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                          </button>

                          <button
                            onClick={() => handleQuickStatusChange(tx.id, 'Approved')}
                            title="Approve Transaction"
                            disabled={tx.status === 'Approved'}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 disabled:opacity-40 transition"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleQuickStatusChange(tx.id, 'Escalated')}
                            title="Escalate for Investigation"
                            disabled={tx.status === 'Escalated'}
                            className="p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 disabled:opacity-40 transition"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleQuickStatusChange(tx.id, 'Rejected')}
                            title="Reject Transaction"
                            disabled={tx.status === 'Rejected'}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 disabled:opacity-40 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t border-slate-200 text-xs text-slate-600">
          <div>
            Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-slate-900">{pagination.total_pages}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.has_prev}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
              disabled={!pagination.has_next}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

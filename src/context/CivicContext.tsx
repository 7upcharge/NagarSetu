'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CivicIssue, Category, Severity, Status } from '../types';
import { INITIAL_ISSUES } from '../lib/mockData';
import { Orchestrator } from '../agents/Orchestrator';
import { RawReportInput } from '../agents/ReportAgent';

interface UserActivity {
  supportedIssueIds: string[];
  reportedIssueIds: string[];
  followedIssueIds: string[];
}

interface CivicContextType {
  issues: CivicIssue[];
  userActivity: UserActivity;
  notification: { message: string; type?: 'info' | 'success' | 'warning' } | null;
  selectedCategory: Category | 'All';
  searchQuery: string;
  sortBy: 'priority' | 'affected' | 'supported' | 'newest' | 'resolved';
  setSelectedCategory: (cat: Category | 'All') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'priority' | 'affected' | 'supported' | 'newest' | 'resolved') => void;
  clearNotification: () => void;
  supportIssue: (issueId: string, deltaReports?: number, deltaAffected?: number) => void;
  createNewReport: (input: RawReportInput) => { newIssue: CivicIssue; matchResult: any };
  simulateImpact: (issueId: string, deltaReports: number, deltaAffected: number) => void;
  simulateSeverity: (issueId: string, newSeverity: Severity) => void;
  simulateEscalation: (issueId: string) => void;
  simulateAction: (issueId: string) => void;
  simulateResolution: (issueId: string) => void;
  resetDemo: () => void;
  getIssueById: (id: string) => CivicIssue | undefined;
}

const CivicContext = createContext<CivicContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'nagarsetu_issues_v1';
const USER_ACTIVITY_KEY = 'nagarsetu_user_activity_v1';

export const CivicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<CivicIssue[]>(INITIAL_ISSUES);
  const [userActivity, setUserActivity] = useState<UserActivity>({
    supportedIssueIds: [],
    reportedIssueIds: [],
    followedIssueIds: []
  });
  const [notification, setNotification] = useState<{ message: string; type?: 'info' | 'success' | 'warning' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priority' | 'affected' | 'supported' | 'newest' | 'resolved'>('priority');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedIssues = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedIssues) {
        setIssues(JSON.parse(savedIssues));
      }
      const savedActivity = localStorage.getItem(USER_ACTIVITY_KEY);
      if (savedActivity) {
        setUserActivity(JSON.parse(savedActivity));
      }
    } catch (e) {
      console.error('Failed to load civic state from localStorage:', e);
    }
  }, []);

  // Save to localStorage when issues change
  const saveIssues = (updatedIssues: CivicIssue[]) => {
    // Keep priority sorted when storing
    const sorted = [...updatedIssues].sort((a, b) => b.priorityScore - a.priorityScore);
    setIssues(sorted);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sorted));
    } catch (e) {
      console.error('Failed to save civic state:', e);
    }
  };

  const saveUserActivity = (updatedActivity: UserActivity) => {
    setUserActivity(updatedActivity);
    try {
      localStorage.setItem(USER_ACTIVITY_KEY, JSON.stringify(updatedActivity));
    } catch (e) {
      console.error('Failed to save user activity:', e);
    }
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  const clearNotification = () => setNotification(null);

  const getIssueById = (id: string) => {
    return issues.find((i) => i.id === id);
  };

  /**
   * User clicks "I'm affected too"
   */
  const supportIssue = (issueId: string, deltaReports = 1, deltaAffected = 1) => {
    const target = issues.find((i) => i.id === issueId);
    if (!target) return;

    const { issue: updated, processingSteps } = Orchestrator.processUserSupport(target, deltaReports, deltaAffected);

    const updatedIssues = issues.map((i) => (i.id === issueId ? updated : i));
    saveIssues(updatedIssues);

    if (!userActivity.supportedIssueIds.includes(issueId)) {
      saveUserActivity({
        ...userActivity,
        supportedIssueIds: [...userActivity.supportedIssueIds, issueId]
      });
    }

    showToast(
      `Added to community report: "${target.title}". Priority score updated to ${updated.priorityScore}.`,
      'success'
    );
  };

  /**
   * Submit new report
   */
  const createNewReport = (input: RawReportInput) => {
    const { issue: newIssue, matchResult } = Orchestrator.processNewReport(input, issues);

    if (!matchResult.hasMatch) {
      const updatedList = [newIssue, ...issues];
      saveIssues(updatedList);

      saveUserActivity({
        ...userActivity,
        reportedIssueIds: [...userActivity.reportedIssueIds, newIssue.id]
      });

      showToast(`New report created: "${newIssue.title}"`, 'success');
    }

    return { newIssue, matchResult };
  };

  /**
   * Demo Simulation Controls
   */
  const simulateImpact = (issueId: string, deltaReports: number, deltaAffected: number) => {
    const target = issues.find((i) => i.id === issueId);
    if (!target) return;

    const { issue: updated } = Orchestrator.processUserSupport(target, deltaReports, deltaAffected);
    saveIssues(issues.map((i) => (i.id === issueId ? updated : i)));
    showToast(`Simulation: +${deltaReports} reports, +${deltaAffected} affected. Priority updated to ${updated.priorityScore}.`, 'info');
  };

  const simulateSeverity = (issueId: string, newSeverity: Severity) => {
    const target = issues.find((i) => i.id === issueId);
    if (!target) return;

    const updated = Orchestrator.processSeverityChange(target, newSeverity);
    saveIssues(issues.map((i) => (i.id === issueId ? updated : i)));
    showToast(`Simulation: Severity set to ${newSeverity}. Priority updated to ${updated.priorityScore}.`, 'warning');
  };

  const simulateEscalation = (issueId: string) => {
    const target = issues.find((i) => i.id === issueId);
    if (!target) return;

    const updated = Orchestrator.processStatusChange(target, 'escalated');
    saveIssues(issues.map((i) => (i.id === issueId ? updated : i)));
    showToast(`Simulation: Issue escalated to ${updated.authority}`, 'info');
  };

  const simulateAction = (issueId: string) => {
    const target = issues.find((i) => i.id === issueId);
    if (!target) return;

    const updated = Orchestrator.processStatusChange(target, 'action_started');
    saveIssues(issues.map((i) => (i.id === issueId ? updated : i)));
    showToast(`Simulation: Action started by ${updated.authority}`, 'success');
  };

  const simulateResolution = (issueId: string) => {
    const target = issues.find((i) => i.id === issueId);
    if (!target) return;

    const updated = Orchestrator.processStatusChange(target, 'resolved');
    saveIssues(issues.map((i) => (i.id === issueId ? updated : i)));
    showToast(`Simulation: Issue marked as Resolved!`, 'success');
  };

  const resetDemo = () => {
    setIssues(INITIAL_ISSUES);
    setUserActivity({ supportedIssueIds: [], reportedIssueIds: [], followedIssueIds: [] });
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(USER_ACTIVITY_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('Demo state reset to seed data.', 'info');
  };

  return (
    <CivicContext.Provider
      value={{
        issues,
        userActivity,
        notification,
        selectedCategory,
        searchQuery,
        sortBy,
        setSelectedCategory,
        setSearchQuery,
        setSortBy,
        clearNotification,
        supportIssue,
        createNewReport,
        simulateImpact,
        simulateSeverity,
        simulateEscalation,
        simulateAction,
        simulateResolution,
        resetDemo,
        getIssueById
      }}
    >
      {children}
    </CivicContext.Provider>
  );
};

export const useCivic = () => {
  const context = useContext(CivicContext);
  if (!context) {
    throw new Error('useCivic must be used within a CivicProvider');
  }
  return context;
};

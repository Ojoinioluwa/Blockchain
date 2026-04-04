import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/amlService';

// --- 1. SEARCH & FETCHING HOOKS (READ) ---

export const useBlacklist = (filters = {}) => {
    return useQuery({
        queryKey: ['blacklist', filters],
        queryFn: () => api.listBlacklist(filters),
    });
};

export const useSanctions = (filters = {}) => {
    return useQuery({
        queryKey: ['sanctions', filters],
        queryFn: () => api.listSanctionedCountries(filters),
    });
};

export const useUsers = (filters = {}) => {
    return useQuery({
        queryKey: ['users', filters],
        queryFn: () => api.listUsers(filters),
    });
};

export const useAuditLogs = (filters = {}) => {
    return useQuery({
        queryKey: ['audit-logs', filters],
        queryFn: () => api.getAuditLogs(filters),
    });
};


// --- 2. ACTION & TRANSACTION HOOKS (WRITE) ---

export const useRegisterUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.registerUser,
        onSuccess: () => {
            // Refresh the user list and audit logs immediately
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
        },
    });
};

export const useTransfer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.transferFunds,
        onSuccess: () => {
            // Refresh logs so the new transaction shows up in history
            queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
        },
        onError: (error) => {
            console.error("Transfer Failed:", error.message);
        }
    });
};

// --- 3. ADMINISTRATIVE HOOKS (COMPLIANCE) ---

export const useAddToBlacklist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.addToBlacklist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blacklist'] });
            queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
        },
    });
};

export const useRemoveFromBlacklist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.removeFromBlacklist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blacklist'] });
            queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
        },
    });
};


export const useRemoveFromSanctions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.RemoveFromSanctions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sanctions'] });
        },
    });
};

export const useAddToSanctions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: api.AddToSanctions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sanctions'] });
        },
    });
};
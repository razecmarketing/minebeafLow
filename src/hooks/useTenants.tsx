import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  settings: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.role === 'root_account') {
      fetchTenants();
    }
  }, [profile?.role]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to load tenants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async (tenantData: Partial<Tenant>) => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([{
          ...tenantData,
          is_active: true,
          settings: tenantData.settings || {}
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchTenants();
      toast({
        title: "Success",
        description: "Tenant created successfully",
        variant: "default",
      });

      return data;
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTenant = async (tenantId: string, updates: Partial<Tenant>) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenantId);

      if (error) throw error;

      await fetchTenants();
      toast({
        title: "Success",
        description: "Tenant updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to update tenant",
        variant: "destructive",
      });
    }
  };

  return {
    tenants,
    loading,
    fetchTenants,
    createTenant,
    updateTenant
  };
};
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      custom_forms: {
        Row: {
          created_at: string | null
          fields: Json
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fields?: Json
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fields?: Json
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_forms_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_approved: boolean | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          tenant_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_approved?: boolean | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_approved?: boolean | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sectors: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sectors_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      task_history: {
        Row: {
          action: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          task_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          task_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          category: string | null
          created_at: string | null
          custom_form_id: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          requester_id: string
          sector_id: string | null
          sla_hours: number | null
          status: Database["public"]["Enums"]["task_status"] | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          custom_form_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          requester_id: string
          sector_id?: string | null
          sla_hours?: number | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          category?: string | null
          created_at?: string | null
          custom_form_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          requester_id?: string
          sector_id?: string | null
          sla_hours?: number | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_custom_form_id_fkey"
            columns: ["custom_form_id"]
            isOneToOne: false
            referencedRelation: "custom_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: string }
        Returns: boolean
      }
      set_admin_password: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "root_account" | "admin" | "common_user"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "pending"
        | "approved"
        | "production"
        | "completed"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["root_account", "admin", "common_user"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: [
        "pending",
        "approved",
        "production",
        "completed",
        "rejected",
      ],
    },
  },
} as const

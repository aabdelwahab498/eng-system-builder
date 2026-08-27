export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17";
  };
  public: {
    Tables: {
      content_items: {
        Row: {
          archived_at: string | null;
          created_at: string;
          created_by: string | null;
          data: Json;
          featured: boolean;
          id: string;
          kind: Database["public"]["Enums"]["content_kind"];
          previous_slugs: string[];
          published_at: string | null;
          scheduled_at: string | null;
          slug: string;
          sort_order: number;
          state: Database["public"]["Enums"]["workflow_state"];
          updated_at: string;
          updated_by: string | null;
          visible_cv: boolean;
          visible_linkedin: boolean;
          visible_portfolio: boolean;
          visible_public: boolean;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          data?: Json;
          featured?: boolean;
          id?: string;
          kind: Database["public"]["Enums"]["content_kind"];
          previous_slugs?: string[];
          published_at?: string | null;
          scheduled_at?: string | null;
          slug: string;
          sort_order?: number;
          state?: Database["public"]["Enums"]["workflow_state"];
          updated_at?: string;
          updated_by?: string | null;
          visible_cv?: boolean;
          visible_linkedin?: boolean;
          visible_portfolio?: boolean;
          visible_public?: boolean;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          created_by?: string | null;
          data?: Json;
          featured?: boolean;
          id?: string;
          kind?: Database["public"]["Enums"]["content_kind"];
          previous_slugs?: string[];
          published_at?: string | null;
          scheduled_at?: string | null;
          slug?: string;
          sort_order?: number;
          state?: Database["public"]["Enums"]["workflow_state"];
          updated_at?: string;
          updated_by?: string | null;
          visible_cv?: boolean;
          visible_linkedin?: boolean;
          visible_portfolio?: boolean;
          visible_public?: boolean;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt_ar: string | null;
          alt_en: string | null;
          archived: boolean;
          caption_ar: string | null;
          caption_en: string | null;
          created_at: string;
          created_by: string | null;
          filename: string;
          id: string;
          mime_type: string | null;
          public_url: string;
          size_bytes: number | null;
          storage_path: string;
          updated_at: string;
        };
        Insert: {
          alt_ar?: string | null;
          alt_en?: string | null;
          archived?: boolean;
          caption_ar?: string | null;
          caption_en?: string | null;
          created_at?: string;
          created_by?: string | null;
          filename: string;
          id?: string;
          mime_type?: string | null;
          public_url: string;
          size_bytes?: number | null;
          storage_path: string;
          updated_at?: string;
        };
        Update: {
          alt_ar?: string | null;
          alt_en?: string | null;
          archived?: boolean;
          caption_ar?: string | null;
          caption_en?: string | null;
          created_at?: string;
          created_by?: string | null;
          filename?: string;
          id?: string;
          mime_type?: string | null;
          public_url?: string;
          size_bytes?: number | null;
          storage_path?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_submissions: {
        Row: {
          amount: string | null;
          client_name: string;
          created_at: string;
          currency: string | null;
          email: string | null;
          id: string;
          method_id: string | null;
          note: string;
          project_name: string | null;
          proof_filename: string | null;
          proof_path: string | null;
          proof_size_bytes: number | null;
          proof_type: string | null;
          service_id: string | null;
          service_title: string | null;
          status: string;
          updated_at: string;
          whatsapp: string | null;
        };
        Insert: {
          amount?: string | null;
          client_name?: string;
          created_at?: string;
          currency?: string | null;
          email?: string | null;
          id?: string;
          method_id?: string | null;
          note?: string;
          project_name?: string | null;
          proof_filename?: string | null;
          proof_path?: string | null;
          proof_size_bytes?: number | null;
          proof_type?: string | null;
          service_id?: string | null;
          service_title?: string | null;
          status?: string;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Update: {
          amount?: string | null;
          client_name?: string;
          created_at?: string;
          currency?: string | null;
          email?: string | null;
          id?: string;
          method_id?: string | null;
          note?: string;
          project_name?: string | null;
          proof_filename?: string | null;
          proof_path?: string | null;
          proof_size_bytes?: number | null;
          proof_type?: string | null;
          service_id?: string | null;
          service_title?: string | null;
          status?: string;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      service_requests: {
        Row: {
          admin_note: string;
          attachment_url: string | null;
          budget: string | null;
          client_name: string;
          created_at: string;
          description: string | null;
          email: string | null;
          id: string;
          locale: string;
          platform: string | null;
          preferred_channel: string | null;
          project_name: string | null;
          scope: string | null;
          service_id: string | null;
          service_title: string | null;
          source: string;
          status: string;
          timeline: string | null;
          updated_at: string;
          whatsapp: string | null;
        };
        Insert: {
          admin_note?: string;
          attachment_url?: string | null;
          budget?: string | null;
          client_name: string;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: string;
          locale?: string;
          platform?: string | null;
          preferred_channel?: string | null;
          project_name?: string | null;
          scope?: string | null;
          service_id?: string | null;
          service_title?: string | null;
          source?: string;
          status?: string;
          timeline?: string | null;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Update: {
          admin_note?: string;
          attachment_url?: string | null;
          budget?: string | null;
          client_name?: string;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: string;
          locale?: string;
          platform?: string | null;
          preferred_channel?: string | null;
          project_name?: string | null;
          scope?: string | null;
          service_id?: string | null;
          service_title?: string | null;
          source?: string;
          status?: string;
          timeline?: string | null;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      app_role: "admin" | "editor" | "user";
      content_kind:
        | "profile"
        | "experience"
        | "education"
        | "skill_group"
        | "project"
        | "product"
        | "service"
        | "article"
        | "announcement"
        | "seo"
        | "cv_settings"
        | "social_draft"
        | "gallery_item"
        | "social_campaign"
        | "marketing_campaign"
        | "payment_method";
      workflow_state: "draft" | "review" | "scheduled" | "published" | "archived";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
      content_kind: [
        "profile",
        "experience",
        "education",
        "skill_group",
        "project",
        "product",
        "service",
        "article",
        "announcement",
        "seo",
        "cv_settings",
        "social_draft",
        "gallery_item",
        "social_campaign",
        "marketing_campaign",
        "payment_method",
      ],
      workflow_state: ["draft", "review", "scheduled", "published", "archived"],
    },
  },
} as const;

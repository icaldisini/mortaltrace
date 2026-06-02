export interface DashboardData {
  meta: {
    project_title: string;
    subtitle: string;
    authors: string[];
    institution: string;
    course: string;
    target_disease: string;
    analysis_period: string;
    generated_from: string;
  };
  dataset: {
    raw: {
      rows: number;
      columns: number;
      unique_provinces_raw: number;
    };
    cleaned: {
      rows: number;
      columns: number;
      unique_provinces: number;
      years: number[];
      structure: string;
      provinces_dropped: string[];
    };
    columns: {
      identifier: string[];
      features: string[];
      targets: string[];
      eda_only: string[];
    };
    missing_values_raw: Record<string, { count: number; pct: number }>;
    missing_values_after_cleaning: string;
  };
  descriptive_statistics: Record<string, {
    label: string;
    count: number;
    mean: number;
    std: number;
    min: number;
    q25: number;
    median: number;
    q75: number;
    max: number;
  }>;
  outlier_detection: {
    method: string;
    results: Array<{ variable: string; n_outliers: number; pct: number }>;
    notable_extreme_outliers: Array<{ provinsi: string; tahun: number; [key: string]: any }>;
  };
  temporal_trends: {
    note: string;
    changes_2018_to_2023: Record<string, {
      label: string;
      value_2018: number;
      value_2023: number;
      change_pct: number;
    }>;
    covid_annotation: {
      year: number;
      note: string;
    };
  };
  mortality_composite_ranking: {
    note: string;
    global_range: { min: number; max: number };
    global_mean: number;
    top_5_provinces: Array<{ rank: number; provinsi: string; mortality_composite: number }>;
  };
  discretization: {
    method: string;
    total_transactions: number;
    items_per_transaction: number;
    unique_items: number;
    thresholds: Array<{
      variable: string;
      short_name: string;
      q33: number;
      q67: number;
    }>;
    category_distribution: string;
  };
  fp_growth: {
    parameters: {
      min_support: number;
      min_confidence: number;
      min_lift: number;
      total_transactions: number;
      unique_items: number;
    };
    performance_comparison: {
      fp_growth: { runtime_seconds: number; frequent_itemsets: number };
      apriori: { runtime_seconds: number; frequent_itemsets: number };
      note: string;
    };
    itemsets_distribution: Record<string, number>;
    top_itemsets_by_support: Array<{ itemset: string[]; support: number }>;
    total_rules: number;
    rules_statistics: Record<string, number>;
  };
  policy_rules: {
    target: string;
    total_policy_rules: number;
    stats: Record<string, number>;
    rules: Array<{
      rank: number;
      antecedents: string[];
      consequent: string;
      support: number;
      confidence: number;
      lift: number;
      leverage: number;
      conviction: number;
      interpretation: string;
    }>;
  };
  clustering: {
    features_used: string[];
    data_shape: string;
    kmeans: {
      optimal_k: number;
      selection_reason: string;
      metrics: { silhouette_score: number; davies_bouldin_index: number };
      elbow_data: Array<{ k: number; inertia: number; silhouette: number; davies_bouldin: number }>;
      cluster_profiles: Record<string, {
        n_provinces: number;
        label: string;
        provinces: string[];
        [key: string]: any;
      }>;
      island_distribution: Record<string, Record<string, number>>;
    };
    dbscan: {
      optimal_eps: number;
      optimal_min_samples: number;
      n_clusters: number;
      n_noise: number;
      noise_pct: number;
      metrics: { silhouette_score: number; davies_bouldin_index: number };
      cluster_profiles: Record<string, any>;
      grid_search_top10: Array<any>;
    };
    comparison: Array<{ algoritma: string; n_clusters: number; silhouette: number; davies_bouldin: number; winner: boolean }>;
  };
  regression: {
    target: string;
    validation_strategy: string;
    split: {
      train_rows: number;
      train_years: string;
      test_rows: number;
      test_year: number;
      n_features: number;
    };
    target_range: Record<string, number>;
    models: Array<{
      name: string;
      cv_r2: number;
      cv_mae: number;
      test_r2: number;
      test_mae: number;
      test_rmse: number;
      best_model: boolean;
      performance_label: string;
    }>;
    best_model: {
      name: string;
      target: string;
      cv_r2: number;
      test_r2: number;
      test_mae: number;
      test_rmse: number;
      note: string;
    };
  };
  shap_interpretability: {
    model: string;
    target: string;
    n_samples: number;
    n_features: number;
    feature_importance: Array<{ rank: number; feature: string; label: string; mean_abs_shap: number | null; note?: string }>;
    key_finding: string;
  };
  key_findings: Record<string, string[]>;
  province_list: string[];
}

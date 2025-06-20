-- Sample AI Tools/Solutions for Testing Admin Interface
-- This data will be managed through the admin dashboard

-- First, ensure we have some tool categories
INSERT INTO tool_categories (id, name, description, icon, color, sort_order, is_featured) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Customer Service', 'AI solutions for customer support and engagement', 'Bot', 'bg-blue-600', 1, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Process Automation', 'Streamline workflows with intelligent automation', 'Workflow', 'bg-green-600', 2, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Data Analytics', 'Extract insights from your business data', 'BarChart', 'bg-purple-600', 3, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order,
  is_featured = EXCLUDED.is_featured;

-- Add sample AI tools that will appear as solutions
INSERT INTO ai_tools (
  id, 
  category_id, 
  name, 
  description, 
  detailed_description,
  tool_type,
  complexity_level,
  target_audience,
  use_cases,
  configuration,
  pricing_model,
  tags,
  status,
  is_featured,
  is_public,
  average_rating,
  total_ratings,
  usage_count,
  performance_metrics
) VALUES
  (
    '650e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'AI Customer Support Chatbot',
    'Intelligent chatbot that handles customer inquiries 24/7 with natural language understanding and context awareness.',
    'Our AI Customer Support Chatbot revolutionizes customer service by providing instant, accurate responses to customer queries around the clock. Built with advanced natural language processing, it understands context, handles complex questions, and seamlessly escalates to human agents when needed. The system learns from each interaction to continuously improve response quality and customer satisfaction.',
    'chatbot',
    'intermediate',
    ARRAY['retail', 'ecommerce', 'saas', 'healthcare'],
    ARRAY['customer support', 'lead qualification', 'order tracking', 'FAQ automation'],
    '{"implementation_time": "2-4 weeks", "solution_type": true, "features": ["24/7 availability", "Multi-language support", "CRM integration", "Analytics dashboard"]}',
    'subscription',
    ARRAY['Natural Language Processing', 'Machine Learning', 'CRM Integration', 'Multi-channel Support'],
    'active',
    true,
    true,
    4.8,
    15,
    342,
    '{"response_time": "< 2 seconds", "accuracy": "94%", "customer_satisfaction": "4.7/5"}'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'Document Processing Automation',
    'AI-powered solution that extracts, processes, and organizes information from documents automatically.',
    'Transform your document workflows with our intelligent Document Processing Automation solution. Using cutting-edge OCR and machine learning algorithms, this system automatically extracts key information from invoices, contracts, forms, and other business documents. It reduces manual data entry by up to 90% while maintaining high accuracy and compliance standards.',
    'automation',
    'advanced',
    ARRAY['finance', 'legal', 'healthcare', 'manufacturing'],
    ARRAY['invoice processing', 'contract analysis', 'data entry automation', 'compliance documentation'],
    '{"implementation_time": "4-8 weeks", "solution_type": true, "features": ["OCR technology", "Template learning", "Workflow integration", "Audit trails"]}',
    'custom',
    ARRAY['OCR', 'Machine Learning', 'Document AI', 'Workflow Automation', 'API Integration'],
    'active',
    true,
    true,
    4.9,
    23,
    187,
    '{"processing_speed": "500 docs/hour", "accuracy": "98%", "cost_savings": "75%"}'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'Predictive Analytics Dashboard',
    'Real-time business intelligence platform that predicts trends and identifies opportunities using advanced analytics.',
    'Make data-driven decisions with confidence using our Predictive Analytics Dashboard. This comprehensive platform analyzes your business data to forecast trends, identify potential issues before they occur, and uncover hidden opportunities. With intuitive visualizations and customizable alerts, you can stay ahead of market changes and optimize your operations for maximum efficiency.',
    'analysis',
    'expert',
    ARRAY['retail', 'manufacturing', 'finance', 'logistics'],
    ARRAY['demand forecasting', 'inventory optimization', 'sales prediction', 'risk assessment'],
    '{"implementation_time": "6-12 weeks", "solution_type": true, "features": ["Real-time dashboards", "Predictive modeling", "Custom alerts", "Multi-source integration"]}',
    'custom',
    ARRAY['Machine Learning', 'Business Intelligence', 'Data Visualization', 'Statistical Modeling', 'Cloud Computing'],
    'active',
    false,
    true,
    4.6,
    8,
    94,
    '{"forecast_accuracy": "87%", "insight_generation": "Real-time", "roi_improvement": "35%"}'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440002',
    'Smart Inventory Management',
    'AI-driven inventory optimization system that reduces costs and prevents stockouts through intelligent forecasting.',
    'Optimize your inventory management with our Smart Inventory Management solution. By analyzing historical data, market trends, and external factors, this AI system provides accurate demand forecasts and automated reorder recommendations. Reduce carrying costs by up to 30% while maintaining optimal stock levels and customer satisfaction.',
    'automation',
    'intermediate',
    ARRAY['retail', 'ecommerce', 'manufacturing', 'wholesale'],
    ARRAY['inventory optimization', 'demand forecasting', 'automated reordering', 'cost reduction'],
    '{"implementation_time": "3-6 weeks", "solution_type": true, "features": ["Demand forecasting", "Automated alerts", "Integration ready", "Mobile dashboard"]}',
    'subscription',
    ARRAY['Machine Learning', 'Demand Forecasting', 'ERP Integration', 'Mobile Technology'],
    'beta',
    true,
    true,
    4.5,
    12,
    156,
    '{"cost_reduction": "28%", "stockout_prevention": "95%", "forecast_accuracy": "89%"}'
  );

-- Add some user_tool_usage entries for realistic metrics (using dummy user IDs)
-- Note: In a real system, these would be actual user IDs from the auth.users table
INSERT INTO user_tool_usage (
  user_id,
  tool_id,
  session_duration,
  actions_performed,
  success_rate,
  satisfaction_rating,
  use_case,
  session_notes
) VALUES
  ('00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440001', 1800, 12, 0.95, 5, 'customer support', 'Excellent response quality'),
  ('00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440001', 2400, 18, 0.92, 4, 'lead qualification', 'Good lead scoring accuracy'),
  ('00000000-0000-0000-0000-000000000003', '650e8400-e29b-41d4-a716-446655440002', 3600, 45, 0.98, 5, 'invoice processing', 'Significant time savings'),
  ('00000000-0000-0000-0000-000000000004', '650e8400-e29b-41d4-a716-446655440003', 2700, 8, 0.87, 4, 'sales prediction', 'Valuable insights generated')
ON CONFLICT DO NOTHING;
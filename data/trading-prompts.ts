import type { Prompt } from "@/types/prompt"

export const tradingPrompts: Prompt[] = [
  {
    id: "implementing-new-trading-strategy",
    title: "Implementing a New Trading Strategy",
    description:
      "Add a new algorithmic strategy to your trading system with proper methods for analysis, entry/exit conditions, and risk management.",
    categories: ["algorithmic trading", "strategy development", "finance"],
    rating: 88,
    content: `Create a new trading algorithm class that implements a [STRATEGY_TYPE] strategy. The class should include methods for analyzing market data, determining entry/exit conditions, handling risk management, and proper error logging. Make the strategy configurable through external parameters and ensure it follows the design patterns of your existing system.`,
    analysis:
      "This prompt addresses the fundamental need for expanding a trading system's repertoire of strategies. By focusing on both technical implementation (entry/exit conditions) and operational needs (error handling, configuration), it produces well-structured, maintainable strategy implementations.",
    strengths: [
      "Balances specificity with flexibility",
      "Enforces architectural consistency",
      "Addresses both technical and operational needs",
      "Ensures maintainable implementations",
    ],
    example: `Create a new trading algorithm class that implements a "Mean Reversion with Volume Confirmation" strategy. The class should include methods for analyzing market data, determining entry/exit conditions, handling risk management, and proper error logging. The algorithm should identify assets that have moved significantly away from their moving average (2+ standard deviations) but show decreasing volume on the move, suggesting the move may be weakening. It should enter a position in the opposite direction when price starts to return to the mean with increasing volume. Make the strategy configurable through external parameters and ensure it follows the design patterns of your existing system.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "performance-metrics-enhancement",
    title: "Performance Metrics Enhancement",
    description:
      "Add new metrics to better evaluate trading algorithms beyond standard metrics like win rate and profit factor.",
    categories: ["algorithmic trading", "performance analysis", "finance"],
    rating: 90,
    content: `Enhance your performance analytics system to include a new metric called [METRIC_NAME] that measures [METRIC_DESCRIPTION]. Implement the calculation method, update your data storage to record this metric, and integrate it into your algorithm evaluation framework with appropriate weighting relative to existing metrics.`,
    analysis:
      "Performance measurement is crucial for algorithmic trading systems. This prompt focuses on expanding evaluation capabilities beyond standard metrics, enabling more nuanced assessment of trading strategies.",
    strengths: [
      "Comprehensive approach from calculation to integration",
      "Enables more nuanced strategy assessment",
      "Incorporates new metrics into decision-making processes",
      "Improves evaluation framework completeness",
    ],
    example: `Enhance your performance analytics system to include a new metric called "recovery_efficiency" that measures how quickly a trading strategy recovers from drawdowns. Implement the calculation method, update your data storage to record this metric, and integrate it into your algorithm evaluation framework with appropriate weighting relative to existing metrics like Sharpe ratio and maximum drawdown.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-01-18",
    updatedAt: "2024-03-12",
  },
  {
    id: "market-data-integration",
    title: "Market Data Integration",
    description:
      "Expand market data collection capabilities to enable more sophisticated trading strategies with access to deeper market data.",
    categories: ["algorithmic trading", "data engineering", "finance"],
    rating: 85,
    content: `Extend your market data ingestion system to handle additional data types (such as [DATA_TYPE]) from [DATA_SOURCE]. Implement methods to request this data, process the incoming data stream, and store it in your database with appropriate schema modifications. Include error handling for connection issues and data validation.`,
    analysis:
      "Quality and breadth of market data are foundational to algorithmic trading success. This prompt addresses the complete workflow of integrating new data sources: acquisition, processing, storage, and error handling.",
    strengths: [
      "Addresses the complete data integration workflow",
      "Enables more sophisticated strategy development",
      "Includes error handling and validation",
      "Provides potential competitive advantages through unique signals",
    ],
    example: `Extend your market data ingestion system to handle additional data types (such as order book depth data) from your exchange API. Implement methods to request this data, process the incoming data stream, and store it in your database with appropriate schema modifications. Include error handling for connection issues and data validation to ensure data integrity.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-01-22",
    updatedAt: "2024-03-15",
  },
  {
    id: "capital-allocation-strategy",
    title: "Capital Allocation Strategy",
    description:
      "Improve how trading capital is distributed among algorithms to maximize returns while respecting risk management rules.",
    categories: ["algorithmic trading", "risk management", "finance"],
    rating: 93,
    content: `Develop a dynamic capital allocation system that implements a [STRATEGY_NAME] approach. The system should distribute capital among trading algorithms based on [ALLOCATION_CRITERIA], while respecting position sizing limits and risk management rules. Include mechanisms to adjust allocations based on changing market conditions.`,
    analysis:
      "This prompt addresses the critical question of how to distribute limited capital across multiple strategies. The capital allocation decision directly impacts overall system returns—even excellent strategies will underperform if underfunded, while poor strategies may drain resources if overfunded.",
    strengths: [
      "Directly impacts trading returns",
      "Balances performance with risk management",
      "Adapts to changing market conditions",
      "Provides a comprehensive framework for capital management",
    ],
    example: `Develop a dynamic capital allocation system that implements a "Performance-Weighted" approach. The system should distribute capital among trading algorithms based on risk-adjusted returns (Sharpe ratio), win rate, and profit consistency, while respecting position sizing limits and risk management rules. No single algorithm should receive more than 20% of total capital regardless of performance, and include mechanisms to adjust allocations based on changing market conditions.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-01-25",
    updatedAt: "2024-03-18",
  },
  {
    id: "algorithm-selection-framework",
    title: "Algorithm Selection Framework",
    description:
      "Improve the selection of which strategies get deployed to ensure only the most promising strategies are actively trading.",
    categories: ["algorithmic trading", "strategy selection", "finance"],
    rating: 93,
    content: `Design an algorithm selection framework that evaluates and ranks trading strategies using [RANKING_METHOD]. Incorporate factors such as [EVALUATION_FACTORS] in your ranking system, and implement a mechanism to ensure stability in selections while still being responsive to changing performance patterns.`,
    analysis:
      "Not all strategies perform well in all market conditions. This prompt addresses the need for intelligent selection among available strategies based on multiple evaluation factors. By incorporating both historical performance and stability mechanisms, it helps create systems that adapt to changing markets without excessive fluctuation in the active strategy set.",
    strengths: [
      "Adapts to changing market conditions",
      "Balances responsiveness with stability",
      "Uses multi-factor evaluation for better decisions",
      "Optimizes active strategy selection",
    ],
    example: `Design an algorithm selection framework that evaluates and ranks trading strategies using a multi-factor scoring system. Incorporate factors such as historical performance, consistency across market regimes, correlation with other active strategies, and recent volatility-adjusted returns in your ranking system. Implement a mechanism to ensure stability in selections while still being responsive to changing performance patterns, such as using moving averages of rankings or requiring significant score changes before modifying the active strategy set.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-01-28",
    updatedAt: "2024-03-20",
  },
  {
    id: "database-optimization",
    title: "Database Optimization",
    description:
      "Improve performance of database operations for market data to ensure system responsiveness when working with massive amounts of time-series data.",
    categories: ["algorithmic trading", "database performance", "finance"],
    rating: 83,
    content: `Optimize the database operations in your trading system to handle high-frequency market data more efficiently. Focus on optimizing queries for [SPECIFIC_OPERATIONS], implement appropriate indexing strategies, consider data partitioning based on time periods, and optimize connection pooling and query caching to minimize latency.`,
    analysis:
      "Algorithmic trading systems typically manage enormous volumes of market data, making database efficiency critical. This prompt focuses on optimizing the database layer to handle high-frequency time series data, which directly impacts system responsiveness and backtesting capabilities.",
    strengths: [
      "Addresses all major aspects of database performance",
      "Improves system responsiveness",
      "Enhances backtesting capabilities",
      "Optimizes handling of time-series data",
    ],
    example: `Optimize the database operations in your trading system to handle high-frequency market data more efficiently. Focus on optimizing queries for historical backtesting, real-time performance calculations, and market data retrieval, implement appropriate indexing strategies, consider data partitioning based on time periods, and optimize connection pooling and query caching to minimize latency during peak trading hours.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-02-01",
    updatedAt: "2024-03-22",
  },
  {
    id: "trading-dashboard-enhancement",
    title: "Trading Dashboard Enhancement",
    description:
      "Improve the user interface for monitoring trading activity to enable better oversight and faster response to issues.",
    categories: ["algorithmic trading", "user interface", "finance"],
    rating: 73,
    content: `Enhance your trading dashboard to implement [FEATURE_DESCRIPTION] for better system monitoring and control. The interface should display [SPECIFIC_DATA] in real-time, include interactive elements for [INTERACTION_DETAILS], and maintain performance even with high data throughput. Include appropriate alerting mechanisms for critical conditions.`,
    analysis:
      "Effective monitoring is essential for algorithmic trading oversight. This prompt addresses user interface enhancements that improve visibility into system operation and performance. The focus on real-time data, interactivity, and alerting mechanisms enables faster and better-informed operational decisions.",
    strengths: [
      "Improves operational oversight",
      "Enables faster response to issues",
      "Provides real-time performance visibility",
      "Includes critical alerting mechanisms",
    ],
    example: `Enhance your trading dashboard to implement real-time performance visualization for better system monitoring and control. The interface should display trade entries/exits, equity curves, and key metrics in real-time, include interactive elements for filtering by strategy/asset/time period and drilling down into specific trade details, and maintain performance even with high data throughput. Include appropriate alerting mechanisms for drawdown thresholds, unusual trade frequencies, or system errors.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-02-05",
    updatedAt: "2024-03-25",
  },
  {
    id: "backtesting-framework",
    title: "Backtesting Framework",
    description:
      "Enable historical simulation of trading strategies to validate performance before deploying with real capital.",
    categories: ["algorithmic trading", "strategy testing", "finance"],
    rating: 90,
    content: `Implement a comprehensive backtesting framework for simulating trading strategy performance against historical data. The system should support [SPECIFIC_CAPABILITIES], account for [REALISTIC_FACTORS] like slippage and fees, generate detailed performance metrics, and provide visualization of results for strategy comparison.`,
    analysis:
      "Backtesting is a cornerstone of algorithmic strategy development. This prompt addresses the creation of a comprehensive simulation environment that balances historical accuracy with forward-looking utility. By incorporating realistic factors like slippage and supporting advanced techniques like walk-forward analysis, it enables more reliable strategy validation before deploying capital.",
    strengths: [
      "Reduces development risk",
      "Enables reliable strategy validation",
      "Incorporates realistic market factors",
      "Supports advanced testing techniques",
    ],
    example: `Implement a comprehensive backtesting framework for simulating trading strategy performance against historical data. The system should support both single-asset and multi-asset strategy testing, parameter optimization through grid search, and walk-forward analysis. Account for realistic factors like slippage, commission fees, and market impact based on trade size, generate detailed performance metrics including drawdown profiles and regime analysis, and provide visualization of results for strategy comparison across different market conditions.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-02-08",
    updatedAt: "2024-03-28",
  },
  {
    id: "risk-management-system",
    title: "Risk Management System",
    description:
      "Add safeguards to prevent excessive losses and protect trading capital during adverse market conditions.",
    categories: ["algorithmic trading", "risk management", "finance"],
    rating: 90,
    content: `Design a multi-level risk management system that monitors trading activity and automatically intervenes when [RISK_CONDITIONS] are detected. Include per-strategy controls, account-level protections, and market condition filters. Make risk parameters configurable and implement a notification system for risk events.`,
    analysis:
      "Effective risk management is critical for long-term trading success. This prompt addresses the creation of multi-layered protections that operate at different levels of the system. The focus on automatic intervention, configurability, and notifications creates a comprehensive safety framework that can prevent catastrophic losses from strategy failures or adverse market conditions.",
    strengths: [
      "Provides critical protection against losses",
      "Implements multi-layered safeguards",
      "Includes automatic intervention mechanisms",
      "Offers configurable risk parameters",
    ],
    example: `Design a multi-level risk management system that monitors trading activity and automatically intervenes when excessive drawdown, unusual trade frequency, or adverse market conditions are detected. Include per-strategy controls (such as pausing after consecutive losses), account-level protections (maximum daily drawdown limits), and market condition filters (volatility-based position sizing). Make risk parameters configurable and implement a notification system for risk events that alerts the appropriate team members based on severity.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-02-12",
    updatedAt: "2024-03-30",
  },
  {
    id: "multi-exchange-integration",
    title: "Multi-Exchange Integration",
    description:
      "Expand trading capabilities across multiple venues to increase opportunities and improve system resilience.",
    categories: ["algorithmic trading", "exchange integration", "finance"],
    rating: 83,
    content: `Develop a modular exchange integration framework that supports trading across multiple exchanges/brokers. Create an abstraction layer that standardizes [COMMON_OPERATIONS] across different APIs, handles the specific requirements of each exchange, and provides a unified interface for your trading strategies to interact with any supported venue.`,
    analysis:
      "Trading across multiple exchanges provides diversification benefits and access to more opportunities. This prompt addresses the architectural challenge of creating a unified interface that handles the complexities and differences between exchange APIs. The modular approach supports system expansion without requiring changes to core strategy logic.",
    strengths: [
      "Increases trading opportunities",
      "Improves system resilience through diversification",
      "Simplifies strategy development across venues",
      "Supports system expansion",
    ],
    example: `Develop a modular exchange integration framework that supports trading across multiple exchanges/brokers. Create an abstraction layer that standardizes data retrieval, order execution, position management, and account balance monitoring across different APIs, handles the specific requirements of each exchange (rate limits, order types, authentication), and provides a unified interface for your trading strategies to interact with any supported venue without modifying the strategy code.`,
    createdBy: "Trading Systems Team",
    createdAt: "2024-02-15",
    updatedAt: "2024-04-01",
  },
]

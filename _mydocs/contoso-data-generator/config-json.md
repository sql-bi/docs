---
layout:     page
title:      Configuration file (config.json)
menu_title: Configuration file
published:  true
order:      /06
---

This file contains the main configuration of the data generator.
- **OrdersCount**: (int) Total number of orders to be generated.

- **StartDT**: (datetime) Date of the first order.

- **YearsCount**: (int) Total number of years generated. Orders are distributed over the years.

- **CutDateBefore**, **CutDateAfter**: (datetime optional parameters) The 2 parameters allow creating data starting from a day different from January 1st  and ending on a date different from December 31st. Data before CutDateBefore and after CutDateAfter is removed

- **CustomerPercentage** : Percentage of customers to be used. Range: 0.001 - 1.000

- **OutputFormat** : Format of the data to be generated. Values: CSV, PARQUET, DELTATABLE

- **SalesOrders** : Type of data to be generated. Values: SALES / ORDERS / BOTH.  
    - SALES = creates the "sales" table.
    - ORDERS = creates the "orders" and the "orders details" table.
    - BOTH =  creates all the previous tables ("sales", "orders", and "orders details").

- **CustomerFakeGenerator**: (int) Number of full random customers. Only used during tests to speed up the process.

- **DaysWeight** (section)

    - **DaysWeightConstant**: (bool) If set to true, the configuration about days is ignored.

    - **DaysWeightPoints**, **DaysWeighValues**: (double[]) Points for interpolating the curve of distribution of orders over time. It covers the entire YearsCount period.

    - **DaysWeightAddSpikes**: (bool) If set to false, annual spikes are ignored.

    - **WeekDaysFactor**: (double[] - length 7) Weight multiplication factor for each day of the week. The first day is Sunday.

    - **DayRandomness**: (double) Percentage of randomness added to days, to avoid having a too-perfect curve over time.

- **OrderRowsWeights**: (double[]) Distribution of the number of rows per order. Each element is a weight. The first element is the weight of orders with one row, the second is the weight of orders with two rows. and so on

- **OrderQuantityWeights**: (double[]) Distribution of the quantity applied to each order row. Each element is a weight. The first element is the weight of rows with quantity=1, the second element is the weight of rows with quantity=2, and so on.

- **DiscountWeights**: (double[]) Distribution of the discounts applied to order rows. Each element is a weight. The first element is the weight of rows with a discount of 0%, the second element is the weight of rows with a discount of 1%, and so on.

- **OnlinePerCent**: (double[]) Distribution of the percentage of orders sold online, over the orders total. 

- **DeliveryDateLambdaWeights**: (double[]) Distribution of the days for delivery. The delivery date is computed by adding one day plus a random number generated using the distribution built from this parameter.

- **CountryCurrency**: Table mapping Country to Currency

- **AnnualSpikes** : Set of periods where orders show a spike. For each spike, you define the start day, the end day, and the multiplication factor.

- **OneTimeSpikes**: Set of spikes with a fixed start and end date. For each spike, you define the start end, the end date, and the multiplication factor.

- **CustomerActivity** : Contains the configuration for customer start/end date

    - **StartDateWeightPoints**, **StartDateWeightValues**: Configuration for the spline of customer start date

    - **EndDateWeightPoints**, **EndDateWeightValues**: Configuration for the spline of customer end dates

const CostCalculator = require("../../models/CostCalculator/costCalculator");

const getBaseCostPerAcre = (crop) => {
      const baseCosts = {
          'Gotukola': 150,
          'Carrot': 120,
          'Pumpkin': 200,
          'Leeks': 180,
      };
      return baseCosts[crop] || 100; // Default base cost if crop is not found
   };
   
   const adjustCostForWaterResources = (waterResources) => {
      const waterCostMultiplier = {
          'Abundant': 0.8,
          'Moderate': 1.0,
          'Scarce': 1.5,
          'Limited': 1.3,
      };
      return waterCostMultiplier[waterResources] || 1.0; // Default multiplier
   };
   
   const adjustCostForSoilType = (soilType) => {
      const soilCostMultiplier = {
          'Fertile': 0.9,
          'Moderately Fertile': 1.1,
          'Poor': 1.3,
          'Sandy': 1.2,
          'Rich': 0.8,
      };
      return soilCostMultiplier[soilType] || 1.0; // Default multiplier
   };
   
   const determineFertilizerNeeds = (crop, soilType) => {
      return `Fertilizer needs for ${crop} in ${soilType} soil.`;
   };
   
   const determineWaterNeeds = (crop, area, waterResources) => {
      return `Water needs for ${crop} over ${area} acres with ${waterResources} water resources.`;
   };
   
   // Main calculation function
   
   exports.calculateCost = async (req, res) => {
      try {
          const { crop, area, waterResources, soilType, userId } = req.body;
   
          if (!crop || !area || !waterResources || !soilType) {
              throw new Error('Missing required input fields');
          }
   
          const baseCostPerAcre = getBaseCostPerAcre(crop);
          const waterCostAdjustment = adjustCostForWaterResources(waterResources);
          const soilCostAdjustment = adjustCostForSoilType(soilType);
   
          if (baseCostPerAcre === undefined || waterCostAdjustment === undefined || soilCostAdjustment === undefined) {
              throw new Error('Calculation parameters not properly defined');
          }
   
          const estimatedCost = area * baseCostPerAcre * waterCostAdjustment * soilCostAdjustment;
   
          const fertilizerNeeds = determineFertilizerNeeds(crop, soilType);
          const waterNeeds = determineWaterNeeds(crop, area, waterResources);
   
          const newCalculation = new CostCalculator({
            crop,
            area,
            waterResources,
            soilType,
            estimatedCost,
            fertilizerNeeds,
            waterNeeds,
            userId
          });
   
          await newCalculation.save();
   
          res.status(200).json(newCalculation);
      } catch (error) {
          console.error('Error calculating cost:', error.message);
          res.status(500).json({ message: 'Error calculating cost. Please try again.' });
      }
   };

exports.previousCalculations = async (req, res) => {
  try {
    const { userId } = req.query; // Retrieve userId from query parameters
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const calculations = await CostCalculator.find({ userId });
    res.status(200).json(calculations);
  } catch (error) {
    console.error('Error fetching user calculations:', error.message);
    res.status(500).json({ message: 'Error fetching calculations. Please try again.' });
  }
};

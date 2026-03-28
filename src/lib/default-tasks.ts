export type Frequency =
  | "monthly"
  | "bi_monthly"
  | "six_monthly"
  | "annual"
  | "two_year"
  | "five_year";

export interface DefaultTask {
  name: string;
  frequency: Frequency;
  notes?: string;
  purchase_link?: string;
}

export const DEFAULT_TASKS: DefaultTask[] = [
  // ──────────────────────────────────────────
  // Monthly
  // ──────────────────────────────────────────
  { name: "Test smoke and CO detectors", frequency: "monthly", notes: "Press the test button on each unit and verify the alarm sounds." },
  { name: "Inspect fire extinguisher", frequency: "monthly", notes: "Check the pressure gauge is in the green zone." },
  { name: "Check for leaks under sinks", frequency: "monthly", notes: "Look under kitchen and bathroom sinks for drips or moisture." },
  { name: "Clean garbage disposal", frequency: "monthly", notes: "Run ice cubes and lemon peels through the disposal to clean and deodorize." },
  { name: "Check HVAC air vents for blockages", frequency: "monthly", notes: "Ensure furniture and objects are not blocking vents." },
  { name: "Inspect caulking around tubs and showers", frequency: "monthly", notes: "Look for cracks or gaps that could let moisture in." },
  { name: "Clean kitchen drains", frequency: "monthly", notes: "Pour baking soda and vinegar down drains to prevent buildup and odors." },
  { name: "Check water heater temperature setting", frequency: "monthly", notes: "Verify it is set to 120°F to prevent scalding and save energy." },
  // Septic
  { name: "Walk and inspect septic system area", frequency: "monthly", notes: "Check tank lids for cracks or damage. Look for wet spots, odors, or standing water near the tank and drainfield." },
  { name: "Test septic alarm and float switches", frequency: "monthly", notes: "If your system has an alarm, press the test button to confirm it activates properly." },
  // Generator
  { name: "Run generator full-load test", frequency: "monthly", notes: "Turn on the generator and run your essential devices for 15-20 minutes. Monitor for unusual sounds, smells, or vibrations." },
  { name: "Check generator battery condition", frequency: "monthly", notes: "Inspect battery terminals for corrosion, verify charge level, and clean terminals if needed." },
  // Geothermal
  { name: "Check/replace geothermal air filters", frequency: "monthly", notes: "Clean or replace the heat pump's air filters, especially during heavy-use seasons." },
  { name: "Check thermostat operation", frequency: "monthly", notes: "Verify thermostat is displaying correct temps and responding to adjustments." },
  // Solar
  { name: "Monitor solar panel system output", frequency: "monthly", notes: "Check your monitoring app for sudden drops in energy production that may indicate panel issues, shading, or inverter problems." },

  // ──────────────────────────────────────────
  // Bi-monthly (every 2 months)
  // ──────────────────────────────────────────
  { name: "Replace HVAC filters", frequency: "bi_monthly", notes: "Use the correct size filter for your system. Check filter size on the existing filter." },
  { name: "Check water softener salt level", frequency: "bi_monthly", notes: "Refill salt if the level is below half. Break up any salt bridges in the brine tank." },
  { name: "Clean range hood filter", frequency: "bi_monthly", notes: "Soak in hot water with degreaser, scrub, and dry." },
  { name: "Test garage door auto-reverse safety", frequency: "bi_monthly", notes: "Place a board under the door and verify it reverses on contact." },
  { name: "Run water in unused fixtures", frequency: "bi_monthly", notes: "Run water briefly in rarely-used sinks, tubs, or showers to prevent dried-out P-traps." },
  { name: "Lubricate door hinges and locks", frequency: "bi_monthly", notes: "Apply lubricant to squeaky hinges and sticky locks to prevent wear." },
  // Generator
  { name: "Check generator oil and coolant levels", frequency: "bi_monthly", notes: "Visually verify oil level on the dipstick and coolant level in the reservoir. Top off if low." },

  // ──────────────────────────────────────────
  // Every 6 months
  // ──────────────────────────────────────────
  { name: "Deep clean refrigerator coils", frequency: "six_monthly", notes: "Pull the fridge out and vacuum the condenser coils on the back or bottom." },
  { name: "Test all GFCI outlets", frequency: "six_monthly", notes: "Press the test and reset buttons on each GFCI outlet." },
  { name: "Flush hot water heater", frequency: "six_monthly", notes: "Attach a garden hose to the drain valve and flush sediment." },
  { name: "Inspect washing machine hoses", frequency: "six_monthly", notes: "Look for bulges, cracks, or leaks. Replace if older than 5 years." },
  { name: "Clean dryer vent and duct", frequency: "six_monthly", notes: "Disconnect and clean the entire vent run to prevent fire hazard." },
  { name: "Check and clean sump pump", frequency: "six_monthly", notes: "Pour water in the pit to verify the pump activates and drains." },
  { name: "Vacuum bathroom exhaust fans", frequency: "six_monthly", notes: "Remove the cover and vacuum dust from the fan blades." },
  { name: "Inspect and clean window weep holes", frequency: "six_monthly", notes: "Clear any debris blocking the small drainage holes at the bottom of window frames." },
  { name: "Inspect and clean ceiling fans", frequency: "six_monthly", notes: "Wipe down blades, check for wobble, and reverse direction seasonally (clockwise in winter, counterclockwise in summer)." },
  { name: "Check toilet components for leaks", frequency: "six_monthly", notes: "Drop food coloring in the tank; if color appears in the bowl without flushing, the flapper needs replacement." },
  { name: "Inspect window tracks and hardware", frequency: "six_monthly", notes: "Vacuum debris from tracks, lubricate hardware, and ensure windows open and lock properly." },
  // Septic
  { name: "Inspect and clean septic effluent filter", frequency: "six_monthly", notes: "If your tank has an effluent filter, remove it and rinse with a garden hose, washing solids back into the tank." },
  { name: "Check that runoff drains away from drainfield", frequency: "six_monthly", notes: "After storms, inspect for standing water. Ensure gutters, downspouts, and sump pumps channel water away from the drainfield." },
  { name: "Inspect drainfield for damage", frequency: "six_monthly", notes: "Avoid driving or parking on the drainfield. Check for soggy areas, surfacing sewage, or tree root encroachment." },
  // Generator
  { name: "Inspect generator air filter", frequency: "six_monthly", notes: "Check the air filter for dirt or damage. Replace if dirty." },
  { name: "Clean generator air vents and fans", frequency: "six_monthly", notes: "Remove dust buildup from intake and exhaust areas using a soft brush or compressed air." },
  { name: "Inspect generator cables, hoses, and connections", frequency: "six_monthly", notes: "Check for rust on terminals, loose connections, frayed cords, and cracked hoses." },
  // Geothermal
  { name: "Check geothermal condensate drain", frequency: "six_monthly", notes: "Inspect the condensate drain line to make sure it is not clogged with dirt or algae." },
  { name: "Clear area around indoor heat pump unit", frequency: "six_monthly", notes: "Remove clutter within a few feet of the unit to ensure airflow and technician access." },
  { name: "Monitor yard for ground loop issues", frequency: "six_monthly", notes: "Watch for sinkholes, unusual wet/muddy spots, soil shifts, or unusual vegetation near the ground loop area." },
  // Solar
  { name: "Visual inspection of solar panels", frequency: "six_monthly", notes: "Use binoculars to check for debris, visible damage (cracks, discoloration), loose wiring, and bird nesting. Check after severe storms." },
  { name: "Clean solar panels", frequency: "six_monthly", notes: "Gently remove dirt with a soft brush or microfiber cloth and rinse with low-pressure water. Avoid abrasive tools. Clean during cool, overcast conditions." },

  // ──────────────────────────────────────────
  // Annual
  // ──────────────────────────────────────────
  { name: "Schedule HVAC professional service", frequency: "annual", notes: "Have a technician inspect and service both heating and cooling systems." },
  { name: "Clean gutters and downspouts", frequency: "annual", notes: "Remove leaves and debris. Check downspouts drain away from foundation." },
  { name: "Inspect roof from ground level", frequency: "annual", notes: "Use binoculars to look for missing or damaged shingles, flashing issues." },
  { name: "Change refrigerator water filter", frequency: "annual", notes: "Replace per manufacturer instructions." },
  { name: "Test water pressure", frequency: "annual", notes: "Use a pressure gauge on a hose bib. Normal is 40-80 PSI. High pressure can damage fixtures and pipes." },
  { name: "Inspect attic for leaks and pests", frequency: "annual", notes: "Look for water stains, daylight through roof, or signs of rodents/insects." },
  { name: "Service garage door springs and opener", frequency: "annual", notes: "Lubricate tracks, rollers, hinges with white lithium grease. Check spring tension, cables for fraying, and test safety features." },
  { name: "Check and replace smoke/CO detector batteries", frequency: "annual", notes: "Replace batteries in all units even if they still test OK." },
  { name: "Inspect foundation for cracks", frequency: "annual", notes: "Walk the perimeter and look for new or widening cracks." },
  { name: "Clean and inspect chimney/fireplace", frequency: "annual", notes: "Have a professional chimney sweep inspect and clean if you use the fireplace." },
  { name: "Drain and winterize outdoor faucets", frequency: "annual", notes: "Before first freeze, disconnect hoses and shut off interior supply valves." },
  { name: "Deep clean dishwasher", frequency: "annual", notes: "Clean the filter, spray arms, and run an empty cycle with vinegar." },
  { name: "Inspect and reseal grout in tile areas", frequency: "annual", notes: "Reapply grout sealer in bathrooms and kitchen." },
  { name: "Test main water shutoff valve", frequency: "annual", notes: "Turn it off and on to ensure it works and doesn't leak." },
  { name: "Flush water supply lines", frequency: "annual", notes: "Open all faucets fully for a few minutes to flush sediment, especially after periods of non-use." },
  { name: "Test pressure relief valve on water heater", frequency: "annual", notes: "Lift the lever briefly to verify water flows out, then let it snap back. Replace if it leaks afterward." },
  { name: "Inspect crawl space for moisture and pests", frequency: "annual", notes: "Check vapor barrier, look for standing water, pest intrusion, and wood damage." },
  { name: "Clean and seal natural stone countertops", frequency: "annual", notes: "Apply penetrating sealer to granite, marble, or other natural stone surfaces." },
  { name: "Inspect and maintain sprinkler/irrigation system", frequency: "annual", notes: "Check spray heads, adjust coverage, repair leaks, and winterize before first freeze." },
  { name: "Test whole-house surge protector", frequency: "annual", notes: "Verify indicator lights show protection is active. Replace if the unit has taken a major surge hit." },
  { name: "Have dryer vent professionally cleaned", frequency: "annual", notes: "Hire a professional to clean the full vent run from dryer to exterior. Reduces fire risk." },
  // Generator
  { name: "Change generator oil and oil filter", frequency: "annual", notes: "Change engine oil and replace oil filter. Follow manufacturer intervals, typically every 100-200 operating hours or annually." },
  { name: "Replace generator fuel filter", frequency: "annual", notes: "Swap out the fuel filter to prevent fuel system contamination." },
  { name: "Replace generator spark plugs", frequency: "annual", notes: "Install new spark plugs to ensure reliable ignition." },
  { name: "Check/replace generator coolant", frequency: "annual", notes: "Inspect coolant concentration, flush and replace as needed." },
  { name: "Professional generator service and inspection", frequency: "annual", notes: "Have a qualified technician perform a full inspection, load bank test, and service all components." },
  // Geothermal
  { name: "Professional geothermal system inspection", frequency: "annual", notes: "Have a technician inspect the heat pump, ground loop, refrigerant levels, and ductwork. Lubricate moving parts and check electrical connections." },
  { name: "Check geothermal refrigerant levels", frequency: "annual", notes: "Have a professional verify refrigerant charge. Low refrigerant indicates a leak that needs repair." },
  { name: "Test geothermal antifreeze concentration", frequency: "annual", notes: "Have a technician test the antifreeze concentration in the ground loop fluid and top off or replace as needed." },
  { name: "Inspect ductwork for leaks", frequency: "annual", notes: "Check for visible cracks, gaps, or disconnected duct sections. Seal any leaks found." },
  { name: "Clean geothermal condenser and evaporator coils", frequency: "annual", notes: "Remove dust and dirt from coils using a soft brush. Professional deep cleaning recommended." },
  // Solar
  { name: "Inspect solar panel mounting hardware", frequency: "annual", notes: "Check that mounting bolts are secure, brackets are aligned, and no corrosion is present on the racking system." },
  { name: "Inspect solar wiring, conduits, and junction boxes", frequency: "annual", notes: "Look for frayed wires, corrosion at connectors, drooping cables, or animal damage. Verify junction boxes are sealed." },
  { name: "Check solar roof penetration sealing", frequency: "annual", notes: "Inspect caulking and flashing around all roof mount points for signs of water intrusion." },
  { name: "Trim trees near solar panels", frequency: "annual", notes: "Cut back any branches or growth that may be creating new shading on panels." },
  { name: "Inspect solar inverter", frequency: "annual", notes: "Check inverter display for error codes. Listen for unusual buzzing. Clean ventilation openings. Inverters typically last 10-15 years." },

  // ──────────────────────────────────────────
  // Every 2 years
  // ──────────────────────────────────────────
  { name: "Check and replace weatherstripping", frequency: "two_year", notes: "Inspect around doors and windows. Replace if cracked, torn, or gaps visible." },
  { name: "Inspect caulking around windows exterior", frequency: "two_year", notes: "Recaulk any areas where caulk has separated or cracked." },
  { name: "Have carpets professionally cleaned", frequency: "two_year", notes: "Steam cleaning extends carpet life and removes deep dirt." },
  { name: "Inspect electrical panel", frequency: "two_year", notes: "Look for signs of corrosion, burn marks, or tripped breakers. Consider professional inspection." },
  { name: "Flush and inspect water heater anode rod", frequency: "two_year", notes: "Replace the anode rod if heavily corroded to extend tank life." },
  { name: "Power wash siding, driveway, and walkways", frequency: "two_year", notes: "Remove mildew, dirt, and stains from exterior surfaces." },
  { name: "Inspect trees near house for hazards", frequency: "two_year", notes: "Look for dead branches, leaning trees, or roots threatening the foundation, sidewalks, or sewer lines. Have an arborist assess large trees." },
  { name: "Test and flush all water shutoff valves", frequency: "two_year", notes: "Turn each shutoff valve (under sinks, behind toilets, main valve) off and on to prevent them from seizing." },
  { name: "Inspect and clean ductwork", frequency: "two_year", notes: "Have HVAC ducts professionally inspected and cleaned if significant dust, mold, or debris is found." },
  // Generator
  { name: "Replace generator starting battery", frequency: "two_year", notes: "Generator starting batteries typically last 2-3 years. Replace proactively before failure." },
  // Septic
  { name: "Professional septic system inspection", frequency: "two_year", notes: "Have a septic professional inspect the tank, measure sludge and scum layers, and check all mechanical components." },

  // ──────────────────────────────────────────
  // Every 5 years
  // ──────────────────────────────────────────
  { name: "Repaint exterior trim", frequency: "five_year", notes: "Scrape, prime, and repaint any peeling or faded trim." },
  { name: "Reseal or re-stain deck", frequency: "five_year", notes: "Sand if needed, then apply sealant or stain." },
  { name: "Pump and service septic tank", frequency: "five_year", notes: "Have the tank pumped by a professional. Frequency depends on household size and tank size; a typical 1,000-gallon tank for 4 people needs pumping every 3-5 years." },
  { name: "Inspect and replace smoke detectors", frequency: "five_year", notes: "Smoke detectors should be replaced every 10 years, so a mid-life inspection is wise." },
  { name: "Have a full plumbing inspection", frequency: "five_year", notes: "A plumber can check for hidden leaks, pipe condition, and water heater life." },
  { name: "Have sewer/drain line scoped with camera", frequency: "five_year", notes: "A plumber uses a camera to inspect the main sewer line for root intrusion, cracks, or buildup." },
  { name: "Replace washing machine hoses", frequency: "five_year", notes: "Even stainless steel braided hoses should be replaced proactively to prevent flooding." },
  { name: "Inspect and replace caulk around exterior penetrations", frequency: "five_year", notes: "Re-caulk around pipes, cables, vents, and any other wall penetrations where caulk has deteriorated." },
  { name: "Replace water heater anode rod", frequency: "five_year", notes: "The sacrificial anode rod protects the tank from corrosion. Replace before it is fully consumed." },
  // Geothermal
  { name: "Flush and clean geothermal ground loop", frequency: "five_year", notes: "Have a professional flush the ground loop system to remove any buildup and ensure efficient heat transfer." },
  // Solar
  { name: "Professional solar panel full-system inspection", frequency: "five_year", notes: "Professional diagnostics including electrical testing, thermal imaging, structural verification, and comprehensive performance review." },
];

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  monthly: "Monthly",
  bi_monthly: "Every 2 Months",
  six_monthly: "Every 6 Months",
  annual: "Annually",
  two_year: "Every 2 Years",
  five_year: "Every 5 Years",
};

export const FREQUENCY_DAYS: Record<Frequency, number> = {
  monthly: 30,
  bi_monthly: 60,
  six_monthly: 182,
  annual: 365,
  two_year: 730,
  five_year: 1825,
};

Star Color Feature - Visual Reference
======================================

This document shows how the star color feature appears in the application.

BEFORE (without star color):
----------------------------
System: Beta Kalven
Star Type: Vigorous

Warp Status: Normal

System Features: Bountiful, Haven


AFTER (with star color):
------------------------
System: Beta Kalven
Star Type: Vigorous
Star Colour: Pure white

Warp Status: Normal

System Features: Bountiful, Haven


EXAMPLE GENERATED SYSTEMS:
--------------------------

1. System: Dravex-847
   Star Type: Mighty
   Star Colour: Blue-white
   
2. System: Saint Corinth's Light
   Star Type: Luminous
   Star Colour: Golden
   
3. System: Tyrkan Reach
   Star Type: Dull
   Star Colour: Sullen red
   
4. System: K-73.4 Morfex
   Star Type: Anomalous
   Star Colour: Bilious green
   
5. System: Volkar-III
   Star Type: Vigorous
   Star Colour: Brilliant white
   
6. System: Alpha Xendrax
   Star Type: Binary - Vigorous and Luminous
   Star Colour: White and Yellow-orange
   
7. System: von Drakken Claim
   Star Type: Binary - Both stars are Mighty
   Star Colour: Electric blue
   
8. System: Karven Subsector VIII
   Star Type: Luminous
   Star Colour: Yellow-orange


STAR COLOR MAPPINGS:
--------------------

Star Type: Mighty (hot, massive O/B type stars)
Possible Colors:
- Blue
- Blue-white
- Electric blue
- Brilliant blue-white

Star Type: Vigorous (hot A/F type stars)
Possible Colors:
- White
- Pure white
- Brilliant white
- Silver-white

Star Type: Luminous (G/K type stars like Sol)
Possible Colors:
- Yellow
- Yellow-orange
- Golden
- Pale yellow
- Orange-yellow

Star Type: Dull (cool M type red giants/dwarfs)
Possible Colors:
- Red
- Sullen red
- Deep red
- Crimson
- Dark orange-red

Star Type: Anomalous (unnatural Warhammer 40k colors)
Possible Colors:
- Bilious green
- Sickly green
- Virulent green
- Purple
- Violet
- Deep violet
- Barely-visible purple
- Unnatural teal
- Ghostly white
- Pale grey
- Shifting colours
- Prismatic
- Oily black-purple

Star Type: Binary
Colors: Combines the colors from both component stars
- If both stars are the same type: single color
- If stars are different types: "Color1 and Color2"


TECHNICAL DETAILS:
------------------

The star color is:
1. Generated automatically when a system is created
2. Stored in the system data (starColor property)
3. Displayed immediately below "Star Type" in the system description
4. Included in save files (JSON format)
5. Included in exports (RTF, PDF, JSON)
6. Backward compatible with old saves (empty string if not present)

The colors are based on real stellar classification with added Warhammer 40k
flair for Anomalous stars to fit the grimdark setting.

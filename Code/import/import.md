<h1>Import Subalias<img align="right" src="../../Data/images/canvas1.png" width="100px"></h1>

Allows users (requires administrative privileges) to add settings from generated JSONs to SVAR

## Settings Import
[Settings Generator](https://shadow-draconic-development.github.io/Avrae-Egg-Hatchery/)

- `Select Mode`: Changes the mode between "time" and "checks"
    - `Time (seconds):` Time it takes to hatch (time mode)
    - `Cooldown (in seconds):` Cooldown between checks (checks mode)
    - `Number of Checks:` Number of successes required to hatch egg (checks mode)
    - `Skill:` Skill required to succeed on
- `Image URLs`: Add or clear image URLS 
    - Leave URL link box empty in order to clear existing egg images
- `Egg Limit`: Limit the number of eggs that can be in a character's hatchery
    - -1 to remove limit
- `Reliable Talent:` Determine if reliable talent is allowed
    - Default is False
    - Follows 2014 version of Rogue

## Usage
`!egg import [JSON string]`
- `JSON string`
    - Required
    - JSON output from the website above
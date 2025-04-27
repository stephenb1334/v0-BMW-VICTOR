"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { ARCameraFeed } from "@/components/ar-camera-feed"
import { SassyVoiceNarrator } from "@/components/sassy-voice-narrator"
import { HotspotOverlay, type Hotspot } from "@/components/hotspot-overlay"
import { QuizInteraction } from "@/components/quiz-interaction"
import { ProgressTracker } from "@/components/progress-tracker"
import { FallbackMode } from "@/components/fallback-mode"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CatEjectionAR } from "@/components/cat-ejection-ar"

// This would come from your API or JSON files in a real app
const moduleData = {
  "1": {
    page: "/module/1",
    component: "InteractiveARModule",
    moduleId: "dashboard_overview",
    moduleTitle: "Dashboard Overview",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "dashboard_intro_001",
        target: "Driver Instrument Cluster",
        instructionText: "Locate the full digital display behind the steering wheel. Center it in your camera view.",
        voicePrompt:
          "Yup, that big ol' screen in front of you — no, not the radio — the thing that tells you how fast you're breaking the speed limit.",
      },
      {
        stepId: "dashboard_intro_002",
        target: "Center Infotainment Screen",
        instructionText: "Find the wide touchscreen in the center of your dashboard.",
        voicePrompt:
          "Bingo. That's your mission control. If you hit the windshield wipers instead, we're gonna have words.",
      },
      {
        stepId: "dashboard_intro_003",
        target: "Climate Control Panel",
        instructionText: "Spot the row of buttons and knobs for adjusting your A/C and heat below the center screen.",
        voicePrompt:
          "Those buttons? Yeah, those are gonna save you when your wife says it's too cold even though it's 78 degrees.",
      },
      {
        stepId: "dashboard_intro_004",
        target: "Steering Wheel Controls",
        instructionText: "Look at the buttons on both sides of your steering wheel. Make sure you see them clearly.",
        voicePrompt:
          "This is where you pretend you're a fighter pilot. Or at least, where you change the radio without crashing.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["instrument_cluster", "infotainment_screen", "climate_panel", "steering_controls"],
      userActionConfirmation: "Tap on each hotspot when centered to confirm.",
    },
    quiz: {
      enabled: true,
      question: "Which part of the dashboard shows your current speed?",
      options: ["Center Infotainment Screen", "Climate Control Panel", "Driver Instrument Cluster", "Steering Wheel"],
      correctAnswerIndex: 2,
      voiceOnCorrect: "That's right! You still got some brain cells firing after all.",
      voiceOnIncorrect: "Oof. Wrong. But hey, at least you're trying, boomer!",
    },
    completion: {
      nextRoute: "/module/2",
      completionVoicePrompt:
        "Solid start! If you were this sharp back in '85 you might've made regional manager. Onward!",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "2": {
    page: "/module/2",
    component: "InteractiveARModule",
    moduleId: "instrument_cluster",
    moduleTitle: "Understanding the Instrument Cluster",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "cluster_focus_001",
        target: "Speedometer Area",
        instructionText: "Focus your camera on the left gauge showing your current speed.",
        voicePrompt: "There's your speed. No, 40 mph is not the 'new 25'.",
      },
      {
        stepId: "cluster_focus_002",
        target: "Tachometer Area",
        instructionText: "Locate the right-side gauge showing your engine RPMs.",
        voicePrompt: "RPMs. That's how hard the engine's working — not how stressed you get parallel parking.",
      },
      {
        stepId: "cluster_focus_003",
        target: "Fuel & Range Display",
        instructionText: "Spot the fuel gauge showing how far you can go before crying at the pump.",
        voicePrompt: "Fuel gauge. A modern horror story, starring your wallet.",
      },
      {
        stepId: "cluster_focus_004",
        target: "Driving Assistance Indicators",
        instructionText: "Find the icons for lane keeping, blind spot alerts, and cruise control readiness.",
        voicePrompt: "These little lifesavers mean you're driving smart — or at least pretending really well.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["speedometer", "tachometer", "fuel_display", "assistance_icons"],
      userActionConfirmation: "Tap each hotspot when aligned to confirm.",
    },
    quiz: {
      enabled: true,
      question: "Which indicator tells you how fast your engine is spinning?",
      options: ["Fuel Gauge", "Speedometer", "Tachometer", "Blind Spot Monitor"],
      correctAnswerIndex: 2,
      voiceOnCorrect: "You nailed it, professor! Tachometer it is!",
      voiceOnIncorrect: "Nope. Not even close. But hey, points for enthusiasm!",
    },
    completion: {
      nextRoute: "/module/3",
      completionVoicePrompt:
        "Nice work! You're officially smarter than a fifth grader... about cars anyway. Let's roll!",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "3": {
    page: "/module/3",
    component: "InteractiveARModule",
    moduleId: "infotainment_system",
    moduleTitle: "Center Infotainment System Basics",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "infotainment_focus_001",
        target: "Navigation App",
        instructionText: "Find and highlight the navigation map displayed on the center screen.",
        voicePrompt: "There it is — your modern version of asking for directions without the humiliation.",
      },
      {
        stepId: "infotainment_focus_002",
        target: "Media Player",
        instructionText: "Focus on the music or media control area of the screen.",
        voicePrompt: "This is where you pretend you still know what's on the Billboard Top 10.",
      },
      {
        stepId: "infotainment_focus_003",
        target: "Phone Connectivity Status",
        instructionText:
          "Locate the phone connectivity icon showing Bluetooth or Apple CarPlay/Android Auto connection.",
        voicePrompt: "If you see your grandkid's playlist pop up, congrats — you paired it right!",
      },
      {
        stepId: "infotainment_focus_004",
        target: "Settings Menu",
        instructionText: "Spot the main Settings menu icon on the screen.",
        voicePrompt: "Settings — the land of infinite options you'll never touch again after today.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["navigation_app", "media_player", "phone_connectivity", "settings_menu"],
      userActionConfirmation: "Tap each identified hotspot to continue.",
    },
    quiz: {
      enabled: true,
      question: "Where would you go to change your driving display brightness?",
      options: ["Navigation App", "Settings Menu", "Media Player", "Phone Connectivity"],
      correctAnswerIndex: 1,
      voiceOnCorrect: "Correct! You're cooking with gas now!",
      voiceOnIncorrect: "Whoops. Looks like somebody skipped 'Settings 101'. Try again next time!",
    },
    completion: {
      nextRoute: "/module/4",
      completionVoicePrompt:
        "Alright tech wizard, you're officially smarter than your old flip phone. Let's keep going!",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "4": {
    page: "/module/4",
    component: "InteractiveARModule",
    moduleId: "climate_controls",
    moduleTitle: "Climate Control and Comfort Settings",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "climate_focus_001",
        target: "Temperature Adjustment Knobs",
        instructionText: "Focus on the knobs or buttons used to adjust the temperature for driver and passenger sides.",
        voicePrompt: "Left knob, right knob — your new best friends when your wife says she's freezing at 73 degrees.",
      },
      {
        stepId: "climate_focus_002",
        target: "Fan Speed Control",
        instructionText: "Locate the control that adjusts the fan speed.",
        voicePrompt: "Turn up the fan, blow away the cobwebs! Or you know, just get some air moving.",
      },
      {
        stepId: "climate_focus_003",
        target: "Seat Heating Buttons",
        instructionText: "Spot the seat heating buttons for both front seats.",
        voicePrompt: "Seat heaters: proof that modern civilization peaked right here.",
      },
      {
        stepId: "climate_focus_004",
        target: "Seat Cooling/Ventilation Buttons",
        instructionText: "Identify the seat cooling or ventilation button if equipped.",
        voicePrompt: "If your buns are getting cooled while you drive, you're officially living in the future.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["temp_knobs", "fan_speed", "seat_heaters", "seat_coolers"],
      userActionConfirmation: "Tap each feature once it's centered and highlighted.",
    },
    quiz: {
      enabled: true,
      question: "Which control lets you make the cabin warmer or cooler?",
      options: ["Fan Speed Control", "Temperature Adjustment Knobs", "Seat Heating Buttons", "Navigation Screen"],
      correctAnswerIndex: 1,
      voiceOnCorrect: "You're heating up — literally and figuratively. Well done!",
      voiceOnIncorrect: "Wrong. But hey, at least you found the fan, Captain Breeze!",
    },
    completion: {
      nextRoute: "/module/5",
      completionVoicePrompt: "Climate mastered. You're basically Mother Nature now. Next up, drive modes!",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "5": {
    page: "/module/5",
    component: "InteractiveARModule",
    moduleId: "drive_modes",
    moduleTitle: "Exploring BMW Drive Modes",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "drive_modes_focus_001",
        target: "Drive Mode Selector Button",
        instructionText: "Locate the drive mode selector button near the gear shift.",
        voicePrompt: "Find the magic button that turns you from Sunday driver to speed demon in one click.",
      },
      {
        stepId: "drive_modes_focus_002",
        target: "Drive Mode Display on Instrument Cluster",
        instructionText: "Focus on the instrument cluster where the selected drive mode is displayed.",
        voicePrompt: "Glance up — the cluster will flex its muscles when you switch modes.",
      },
      {
        stepId: "drive_modes_focus_003",
        target: "Comfort Mode Highlight",
        instructionText: "Switch into Comfort Mode and confirm the label shows on the display.",
        voicePrompt: "Comfort Mode: when you want to float like a Cadillac and sting like a cushion.",
      },
      {
        stepId: "drive_modes_focus_004",
        target: "Sport Mode Highlight",
        instructionText: "Switch into Sport Mode and confirm it on the screen.",
        voicePrompt: "Sport Mode: Warning — may cause spontaneous tire squeals and smug grins.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["mode_selector", "cluster_drive_mode_display"],
      userActionConfirmation: "Tap mode changes as you confirm them in AR view.",
    },
    quiz: {
      enabled: true,
      question: "Which mode gives you the smoothest, softest ride?",
      options: ["Sport Mode", "Eco Pro Mode", "Adaptive Mode", "Comfort Mode"],
      correctAnswerIndex: 3,
      voiceOnCorrect: "Smooth operator! Comfort Mode for the win!",
      voiceOnIncorrect: "Nope. Wrong answer. I bet you picked Sport Mode didn't you, Hot Rod?",
    },
    completion: {
      nextRoute: "/module/6",
      completionVoicePrompt:
        "You survived Drive Modes! Coming up: how to connect your phone without calling tech support.",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "6": {
    page: "/module/6",
    component: "InteractiveARModule",
    moduleId: "phone_connectivity",
    moduleTitle: "Connecting Your Phone",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "phone_connectivity_focus_001",
        target: "Bluetooth Settings Button",
        instructionText: "Focus on the Bluetooth settings option inside the center infotainment screen.",
        voicePrompt: "Bluetooth: because wires are for boomers.",
      },
      {
        stepId: "phone_connectivity_focus_002",
        target: "Phone List Screen",
        instructionText: "Locate the list of connected or available phones.",
        voicePrompt: "If you see your phone pop up here, you're one step closer to hands-free greatness.",
      },
      {
        stepId: "phone_connectivity_focus_003",
        target: "Apple CarPlay or Android Auto Activation",
        instructionText: "Find the button or setting that activates CarPlay or Android Auto.",
        voicePrompt: "CarPlay and Android Auto: because you deserve maps, music, and memes all at once.",
      },
      {
        stepId: "phone_connectivity_focus_004",
        target: "Connected Device Confirmation",
        instructionText: "Check for confirmation that your device is fully paired and ready.",
        voicePrompt: "Connected? Congratulations, you're now smarter than 75% of tech support.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: [
        "bluetooth_settings",
        "phone_list_screen",
        "carplay_androidauto_activation",
        "connected_device_status",
      ],
      userActionConfirmation: "Tap each hotspot after confirming pairing steps.",
    },
    quiz: {
      enabled: true,
      question: "Which feature lets you mirror apps like Maps and Music on the car screen?",
      options: ["Bluetooth", "WiFi Hotspot", "Apple CarPlay / Android Auto", "Seat Heater Controls"],
      correctAnswerIndex: 2,
      voiceOnCorrect: "Boom! You're a smartphone-in-car sorcerer now!",
      voiceOnIncorrect: "Wrong. Unless you think the seat heater streams Spotify, rethink that.",
    },
    completion: {
      nextRoute: "/module/7",
      completionVoicePrompt: "Phone connected! Now you can ignore all my calls while you drive!",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "7": {
    page: "/module/7",
    component: "InteractiveARModule",
    moduleId: "voice_commands",
    moduleTitle: "Mastering Voice Commands",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "voice_command_focus_001",
        target: "Voice Activation Button on Steering Wheel",
        instructionText: "Find and highlight the microphone button on the right side of the steering wheel.",
        voicePrompt: "See that button? Press it and speak — no wand-waving required.",
      },
      {
        stepId: "voice_command_focus_002",
        target: "Voice Command Listening Screen",
        instructionText:
          "Focus on the infotainment screen displaying the 'listening' status after pressing the button.",
        voicePrompt: "When you see the listening screen, that's your cue to boss the car around like a 5-star general.",
      },
      {
        stepId: "voice_command_focus_003",
        target: "Hey BMW Wake Word Activation",
        instructionText: "Practice saying 'Hey BMW' and watch the dashboard react.",
        voicePrompt: "Say it loud. Say it proud. 'Hey BMW!' It's like magic, but less rabbits.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["voice_button", "listening_screen", "wake_word_reaction"],
      userActionConfirmation: "Tap each hotspot after triggering voice activation.",
    },
    quiz: {
      enabled: true,
      question: "Which command wakes up the BMW's voice system?",
      options: ["'Hey BMW'", "'Okay Car'", "'Yo X6'", "'Activate Siri'"],
      correctAnswerIndex: 0,
      voiceOnCorrect: "Nailed it! Now you're officially talking to inanimate objects — and they're listening!",
      voiceOnIncorrect: "Nope. Try again, Captain Walkie Talkie!",
    },
    completion: {
      nextRoute: "/module/8",
      completionVoicePrompt:
        "Voice mastered! Now let's make sure you can back up without running over the neighbor's mailbox.",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "8": {
    page: "/module/8",
    component: "InteractiveARModule",
    moduleId: "parking_assist",
    moduleTitle: "Using Parking Assistance and Backup Cameras",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "parking_assist_focus_001",
        target: "Parking Assistance Button",
        instructionText: "Find and highlight the Parking Assist 'P' button on the center console or dashboard.",
        voicePrompt: "Push the 'P' button, champ. No, not for 'panic' — it's Parking Assist!",
      },
      {
        stepId: "parking_assist_focus_002",
        target: "Backup Camera View",
        instructionText: "Shift into Reverse and focus on the backup camera view on the infotainment screen.",
        voicePrompt: "See that live rear-view movie? Try not to run over the mailbox cameo.",
      },
      {
        stepId: "parking_assist_focus_003",
        target: "Parking Assist Display Prompts",
        instructionText: "Find the steering prompts or green/yellow/red warning lines displayed while reversing.",
        voicePrompt: "Those colorful lines? They mean 'you're good,' 'you're okay,' or 'you're buying new taillights.'",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["parking_button", "backup_camera_screen", "parking_lines_display"],
      userActionConfirmation: "Tap each AR hotspot as you visually validate them.",
    },
    quiz: {
      enabled: true,
      question: "Which gear must you select to automatically activate the backup camera?",
      options: ["Park", "Neutral", "Reverse", "Drive"],
      correctAnswerIndex: 2,
      voiceOnCorrect: "Reverse it is! Back it up, just like those dance moves you forgot you had!",
      voiceOnIncorrect: "Nope. In Park you're just admiring yourself, not backing up!",
    },
    completion: {
      nextRoute: "/module/9",
      completionVoicePrompt: "Parking ninja unlocked! Now let's make your cabin look like a luxury spa.",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "9": {
    page: "/module/9",
    component: "InteractiveARModule",
    moduleId: "ambient_lighting",
    moduleTitle: "Customizing Ambient Lighting",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "ambient_lighting_focus_001",
        target: "Ambient Lighting Settings Menu",
        instructionText: "Focus on the settings menu where you can adjust ambient lighting color and brightness.",
        voicePrompt: "Time to turn your ride into a rolling nightclub — or at least into a spa on wheels.",
      },
      {
        stepId: "ambient_lighting_focus_002",
        target: "Color Selection Panel",
        instructionText: "Locate the panel where different lighting colors are shown for selection.",
        voicePrompt: "Pick a color. Bonus points if it matches your mood, your shirt, or your cat.",
      },
      {
        stepId: "ambient_lighting_focus_003",
        target: "Brightness Adjustment Control",
        instructionText: "Find the brightness slider or button to control ambient lighting intensity.",
        voicePrompt: "More light? Less light? You're basically the DJ of your own private lounge now.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["ambient_lighting_menu", "color_selection_panel", "brightness_adjustment"],
      userActionConfirmation: "Tap each AR hotspot after confirming the lighting customization steps.",
    },
    quiz: {
      enabled: true,
      question: "Which menu allows you to change the cabin lighting color?",
      options: ["Navigation Settings", "Ambient Lighting Settings", "Climate Control Menu", "Phone Connectivity"],
      correctAnswerIndex: 1,
      voiceOnCorrect: "You got it! Mood lighting maestro in the building!",
      voiceOnIncorrect: "Nope. Unless you think GPS tells you how to pick neon green lighting.",
    },
    completion: {
      nextRoute: "/module/10",
      completionVoicePrompt: "Vibes set! Let's wrap it up by saving your perfect driver settings.",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "10": {
    page: "/module/10",
    component: "InteractiveARModule",
    moduleId: "driver_profile_setup",
    moduleTitle: "Saving Your Driver Profile",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "driver_profile_focus_001",
        target: "Driver Profiles Menu",
        instructionText: "Focus on the settings menu where you can access driver profiles.",
        voicePrompt: "This is where you officially tell your BMW who's boss.",
      },
      {
        stepId: "driver_profile_focus_002",
        target: "Create New Profile Button",
        instructionText: "Locate the option to create or add a new driver profile.",
        voicePrompt: "Hit that 'New Profile' button — time to engrave your name into this spaceship.",
      },
      {
        stepId: "driver_profile_focus_003",
        target: "Save Seat, Mirror, and Climate Settings",
        instructionText: "Adjust and save your seat, mirrors, and climate preferences to your profile.",
        voicePrompt:
          "Dial it all in: seat comfy, mirrors right, temperature cozy — save it like it's your high score at the arcade.",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["driver_profiles_menu", "create_profile_button", "save_settings_screen"],
      userActionConfirmation: "Tap hotspots after completing profile setup and saving settings.",
    },
    quiz: {
      enabled: true,
      question: "Which settings can you save inside your driver profile?",
      options: [
        "Only seat position",
        "Only climate settings",
        "Seat, mirrors, and climate settings",
        "Only favorite radio stations",
      ],
      correctAnswerIndex: 2,
      voiceOnCorrect: "Perfect! Now your throne is set exactly how you like it — every time.",
      voiceOnIncorrect: "Nope. Your favorite 70s radio station won't save your mirror angles, my friend.",
    },
    completion: {
      nextRoute: "/module/11", // Updated to point to our new bonus module
      completionVoicePrompt: "Profile locked and loaded! You've officially tamed the beast. Let's finish strong!",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "blue",
      animationStyle: "pulse_glow",
      hotspotIcons: "circle_pulse_markers",
    },
  },
  "11": {
    page: "/module/11",
    component: "InteractiveARModule",
    moduleId: "cat_ejection_bonus",
    moduleTitle: "Bonus Module: Cat Command!",
    cameraRequirement: "UltraWide 13mm (0.5x zoom locked)",
    objectives: [
      {
        stepId: "cat_bonus_intro_001",
        target: "Passenger Seat Area",
        instructionText:
          "Focus your camera on the front passenger seat. You're about to adopt a virtual travel companion!",
        voicePrompt:
          "Attention cat lovers: Welcome to Victor's Special Bonus Round. Let's give these cats a seat they deserve.",
      },
      {
        stepId: "cat_bonus_place_002",
        target: "Tap to Place Virtual Cat",
        instructionText: "Tap the passenger seat to place a cozy 3D cat onto the seat or lap area.",
        voicePrompt: "Tap gently — you don't want to spook your new furry friend... yet.",
      },
      {
        stepId: "cat_bonus_arming_003",
        target: "Locate the 'Eject Button'",
        instructionText: "An 'Eject Button' has appeared. Tap it to begin the final sequence.",
        voicePrompt: "Locate the Eject Button, Commander. It's about to get... messy.",
      },
      {
        stepId: "cat_bonus_execute_004",
        target: "Launch Cat",
        instructionText:
          "Tap the Eject Button. Watch the sunroof open, hear mechanical sounds, and prepare for lift-off!",
        voicePrompt: "And now, for the moment Victor's been waiting for... EJECT!",
      },
    ],
    successCriteria: {
      visualValidationRequired: true,
      cameraFocusZones: ["passenger_seat_zone", "eject_button_zone"],
      userActionConfirmation: "Follow all taps and visual prompts to complete the bonus.",
    },
    quiz: {
      enabled: false, // No quiz for this fun module
    },
    completion: {
      nextRoute: "/complete",
      completionVoicePrompt: "Cat launched! Mission success! You're now officially ridiculous — and we love that.",
      saveProgress: true,
    },
    visualCueSettings: {
      hotspotHighlightColor: "pink",
      animationStyle: "bounce",
      hotspotIcons: "circle_pulse_markers",
    },
    isBonusModule: true,
  },
}

// Mock hotspot positions for each module
const hotspotPositions = {
  "1": [
    { id: "instrument_cluster", x: 30, y: 40, label: "Driver Instrument Cluster" },
    { id: "infotainment_screen", x: 50, y: 35, label: "Center Infotainment Screen" },
    { id: "climate_panel", x: 50, y: 60, label: "Climate Control Panel" },
    { id: "steering_controls", x: 25, y: 50, label: "Steering Wheel Controls" },
  ],
  "2": [
    { id: "speedometer", x: 25, y: 40, label: "Speedometer" },
    { id: "tachometer", x: 35, y: 40, label: "Tachometer" },
    { id: "fuel_display", x: 30, y: 50, label: "Fuel & Range Display" },
    { id: "assistance_icons", x: 30, y: 30, label: "Driving Assistance Indicators" },
  ],
  "3": [
    { id: "navigation_app", x: 50, y: 30, label: "Navigation App" },
    { id: "media_player", x: 50, y: 40, label: "Media Player" },
    { id: "phone_connectivity", x: 50, y: 50, label: "Phone Connectivity" },
    { id: "settings_menu", x: 50, y: 60, label: "Settings Menu" },
  ],
  "4": [
    { id: "temp_knobs", x: 50, y: 65, label: "Temperature Adjustment Knobs" },
    { id: "fan_speed", x: 55, y: 65, label: "Fan Speed Control" },
    { id: "seat_heaters", x: 45, y: 70, label: "Seat Heating Buttons" },
    { id: "seat_coolers", x: 60, y: 70, label: "Seat Cooling/Ventilation" },
  ],
  "5": [
    { id: "mode_selector", x: 40, y: 65, label: "Drive Mode Selector" },
    { id: "cluster_drive_mode_display", x: 30, y: 40, label: "Drive Mode Display" },
    { id: "comfort_mode", x: 30, y: 45, label: "Comfort Mode" },
    { id: "sport_mode", x: 30, y: 50, label: "Sport Mode" },
  ],
  "6": [
    { id: "bluetooth_settings", x: 50, y: 40, label: "Bluetooth Settings" },
    { id: "phone_list_screen", x: 50, y: 45, label: "Phone List" },
    { id: "carplay_androidauto_activation", x: 50, y: 50, label: "CarPlay/Android Auto" },
    { id: "connected_device_status", x: 50, y: 55, label: "Connected Device Status" },
  ],
  "7": [
    { id: "voice_button", x: 25, y: 45, label: "Voice Activation Button" },
    { id: "listening_screen", x: 50, y: 35, label: "Voice Command Listening Screen" },
    { id: "wake_word_reaction", x: 40, y: 40, label: "Hey BMW Wake Word" },
  ],
  "8": [
    { id: "parking_button", x: 45, y: 65, label: "Parking Assist Button" },
    { id: "backup_camera_screen", x: 50, y: 35, label: "Backup Camera View" },
    { id: "parking_lines_display", x: 50, y: 40, label: "Parking Guide Lines" },
  ],
  "9": [
    { id: "ambient_lighting_menu", x: 50, y: 35, label: "Ambient Lighting Menu" },
    { id: "color_selection_panel", x: 50, y: 45, label: "Color Selection Panel" },
    { id: "brightness_adjustment", x: 50, y: 55, label: "Brightness Control" },
  ],
  "10": [
    { id: "driver_profiles_menu", x: 50, y: 35, label: "Driver Profiles Menu" },
    { id: "create_profile_button", x: 50, y: 45, label: "Create New Profile" },
    { id: "save_settings_screen", x: 50, y: 55, label: "Save Settings" },
  ],
  "11": [
    { id: "passenger_seat_zone", x: 70, y: 50, label: "Passenger Seat" },
    { id: "cat_placement_zone", x: 70, y: 50, label: "Place Cat Here" },
    { id: "eject_button_zone", x: 50, y: 70, label: "Eject Button" },
    { id: "sunroof_zone", x: 50, y: 20, label: "Sunroof" },
  ],
}

export default function ModulePage() {
  const router = useRouter()
  const params = useParams()
  const moduleId = params?.id as string

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [currentVoicePrompt, setCurrentVoicePrompt] = useState<string | undefined>(undefined)
  const [useFallbackMode, setUseFallbackMode] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [newPrompt, setNewPrompt] = useState<string | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)

  // Cat ejection specific states
  const [catPlaced, setCatPlaced] = useState(false)
  const [ejectButtonVisible, setEjectButtonVisible] = useState(false)
  const [catEjected, setCatEjected] = useState(false)
  const [showCatAR, setShowCatAR] = useState(false)

  const module = moduleData[moduleId as keyof typeof moduleData]

  if (!module) {
    return <div>Module not found</div>
  }

  const objectives = module.objectives
  const currentObjective = objectives[currentStep]
  const isBonusModule = module.isBonusModule || false

  const promptRef = useRef<string | undefined>(undefined)
  const [voicePrompt, setVoicePrompt] = useState<string | undefined>(undefined)

  const updateVoicePrompt = useCallback((newPrompt: string | undefined) => {
    promptRef.current = newPrompt
    setVoicePrompt(newPrompt)
  }, [])

  useEffect(() => {
    setIsMounted(true)

    // Check if user has previously opted for fallback mode
    const fallbackMode = localStorage.getItem("bmwX6_fallback_mode") === "true"
    if (fallbackMode) {
      setUseFallbackMode(true)
    }

    // Check if test mode is enabled
    const testModeEnabled = localStorage.getItem("bmwX6_test_mode") === "true"
    if (testModeEnabled) {
      setTestMode(true)
    }

    // Show cat AR for module 11
    if (moduleId === "11") {
      setShowCatAR(true)
    }
  }, [moduleId])

  useEffect(() => {
    if ((cameraReady || useFallbackMode || testMode) && isMounted && currentObjective) {
      setNewPrompt(currentObjective.voicePrompt)
    } else {
      setNewPrompt(undefined)
    }
  }, [currentStep, cameraReady, currentObjective, isMounted, useFallbackMode, testMode])

  useEffect(() => {
    updateVoicePrompt(newPrompt)
  }, [newPrompt, updateVoicePrompt])

  const handleHotspotClick = (hotspotId: string) => {
    // Special handling for cat ejection module
    if (moduleId === "11") {
      if (hotspotId === "passenger_seat_zone" && currentStep === 0) {
        setCurrentStep(1) // Move to place cat step
        return
      }

      if (hotspotId === "cat_placement_zone" && currentStep === 1) {
        setCatPlaced(true)
        setEjectButtonVisible(true)
        setCurrentStep(2) // Move to eject button step
        return
      }

      if (hotspotId === "eject_button_zone" && currentStep === 2) {
        setCurrentStep(3) // Move to launch cat step
        return
      }

      if (hotspotId === "eject_button_zone" && currentStep === 3) {
        setCatEjected(true)
        // Complete the module after a delay
        setTimeout(() => {
          updateVoicePrompt(module.completion.completionVoicePrompt)

          // Navigate to the next module after a delay
          setTimeout(() => {
            router.push(module.completion.nextRoute)
          }, 3000)
        }, 2000)
        return
      }
    }

    // Regular hotspot handling for other modules
    if (!completedSteps.includes(hotspotId)) {
      setCompletedSteps([...completedSteps, hotspotId])

      // If all steps are completed, show the quiz
      if (completedSteps.length + 1 === objectives.length) {
        setTimeout(() => {
          if (module.quiz?.enabled) {
            setShowQuiz(true)
          } else {
            // If no quiz, complete the module
            updateVoicePrompt(module.completion.completionVoicePrompt)

            // Navigate to the next module after a delay
            setTimeout(() => {
              router.push(module.completion.nextRoute)
            }, 3000)
          }
        }, 1000)
      } else {
        // Move to the next step
        const nextStepIndex = completedSteps.length + 1
        if (nextStepIndex < objectives.length) {
          setCurrentStep(nextStepIndex)
        }
      }
    }
  }

  const handleCameraError = () => {
    setCameraError(true)
  }

  const enableFallbackMode = () => {
    setUseFallbackMode(true)
    localStorage.setItem("bmwX6_fallback_mode", "true")
  }

  const handleManualNext = () => {
    if (currentStep < objectives.length - 1) {
      setCurrentStep(currentStep + 1)

      // For cat module in fallback mode, simulate the actions
      if (moduleId === "11") {
        if (currentStep === 0) {
          // Do nothing special for first step
        } else if (currentStep === 1) {
          setCatPlaced(true)
          setEjectButtonVisible(true)
        } else if (currentStep === 2) {
          // Prepare for ejection
        } else if (currentStep === 3) {
          setCatEjected(true)
          // Complete the module after a delay
          setTimeout(() => {
            updateVoicePrompt(module.completion.completionVoicePrompt)

            // Navigate to the next module after a delay
            setTimeout(() => {
              router.push(module.completion.nextRoute)
            }, 3000)
          }, 2000)
        }
      }
    } else if (!showQuiz && module.quiz?.enabled) {
      setShowQuiz(true)
    } else {
      // Complete the module
      updateVoicePrompt(module.completion.completionVoicePrompt)

      // Navigate to the next module after a delay
      setTimeout(() => {
        router.push(module.completion.nextRoute)
      }, 3000)
    }
  }

  const handleQuizCorrect = () => {
    updateVoicePrompt(module.quiz?.voiceOnCorrect)

    // Short delay to allow the voice to play before navigation
    setTimeout(() => {
      updateVoicePrompt(module.completion.completionVoicePrompt)

      // Save progress if needed
      if (module.completion.saveProgress) {
        localStorage.setItem(
          "bmwX6_tutorial_progress",
          JSON.stringify({
            currentModule: Number.parseInt(moduleId),
            totalModules: Object.keys(moduleData).length,
            lastUpdated: new Date().toISOString(),
          }),
        )
      }

      // Navigate to the next module after a delay
      setTimeout(() => {
        router.push(module.completion.nextRoute)
      }, 3000)
    }, 2000)
  }

  const handleQuizIncorrect = () => {
    updateVoicePrompt(module.quiz?.voiceOnIncorrect)
  }

  // Convert hotspot positions to the format expected by HotspotOverlay
  const hotspots: Hotspot[] = (hotspotPositions[moduleId as keyof typeof hotspotPositions] || [])
    .filter((hotspot) => {
      // Filter hotspots based on current step for module 11
      if (moduleId === "11") {
        if (currentStep === 0 && hotspot.id === "passenger_seat_zone") return true
        if (currentStep === 1 && hotspot.id === "cat_placement_zone") return true
        if (currentStep === 2 && hotspot.id === "eject_button_zone") return true
        if (currentStep === 3 && hotspot.id === "eject_button_zone") return true
        return false
      }
      return true
    })
    .map((hotspot) => ({
      ...hotspot,
      size: moduleId === "11" ? "lg" : "md",
      onClick: () => handleHotspotClick(hotspot.id),
    }))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white text-maryland-black p-4 shadow-md border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-maryland-black">{module.moduleTitle}</h1>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-maryland-gold rounded-full mr-2"></div>
            <span className="text-sm text-maryland-black">Victor's X6</span>
          </div>
        </div>
        <ProgressTracker
          currentModule={Number.parseInt(moduleId)}
          totalModules={Object.keys(moduleData).length - (isBonusModule ? 1 : 0)}
        />
      </header>

      <main className="flex-1 p-4 flex flex-col">
        {useFallbackMode ? (
          <FallbackMode
            moduleTitle={module.moduleTitle}
            instructionText={currentObjective?.instructionText || ""}
            onContinue={handleManualNext}
          />
        ) : (
          <ARCameraFeed
            onCameraReady={() => setCameraReady(true)}
            onCameraError={handleCameraError}
            testMode={testMode}
          >
            {(cameraReady || testMode) && !showQuiz && (
              <>
                <HotspotOverlay
                  hotspots={hotspots}
                  animationStyle={module.visualCueSettings.animationStyle as any}
                  highlightColor={moduleId === "11" ? "pink" : "maryland-gold"}
                />

                {/* Show Cat AR component for module 11 */}
                {showCatAR && moduleId === "11" && (
                  <CatEjectionAR
                    catPlaced={catPlaced}
                    ejectButtonVisible={ejectButtonVisible}
                    catEjected={catEjected}
                    currentStep={currentStep}
                  />
                )}
              </>
            )}
          </ARCameraFeed>
        )}

        {cameraError && !useFallbackMode && !testMode && (
          <Card className="mt-4 border-maryland-red/30 bg-white/90">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg mb-2 text-maryland-red">Camera Access Required</h2>
              <p className="text-sm text-gray-700 mb-4">
                This tutorial works best with camera access to provide AR overlays. Please enable camera access in your
                browser settings.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={enableFallbackMode}
                  className="bg-maryland-gold hover:bg-maryland-gold/90 text-maryland-black"
                >
                  Continue Without Camera
                </Button>
                <Button
                  onClick={() => {
                    setTestMode(true)
                    localStorage.setItem("bmwX6_test_mode", "true")
                    window.location.reload()
                  }}
                  variant="outline"
                  className="border-maryland-gold/30"
                >
                  Use Test Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!showQuiz && (cameraReady || useFallbackMode || testMode) ? (
          <Card className={`mt-4 border-${moduleId === "11" ? "pink" : "maryland-gold"}/30 bg-white/90`}>
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg mb-2">{currentObjective?.instructionText}</h2>
              <p className="text-sm text-gray-500">
                {useFallbackMode || testMode
                  ? "Tap Next to continue to the next step"
                  : module.successCriteria.userActionConfirmation}
              </p>
              <div className="mt-2 text-sm">
                <span className="font-medium">Progress: </span>
                {currentStep + 1} of {objectives.length} steps completed
              </div>

              {(useFallbackMode || testMode) && (
                <Button
                  onClick={handleManualNext}
                  className={`mt-4 bg-${moduleId === "11" ? "pink-500" : "maryland-gold"} hover:bg-${moduleId === "11" ? "pink-600" : "maryland-gold/90"} text-${moduleId === "11" ? "white" : "maryland-black"}`}
                >
                  Next Step
                </Button>
              )}
            </CardContent>
          </Card>
        ) : showQuiz ? (
          <div className="mt-4">
            <QuizInteraction
              question={module.quiz?.question || ""}
              options={module.quiz?.options || []}
              correctAnswerIndex={module.quiz?.correctAnswerIndex || 0}
              onCorrect={handleQuizCorrect}
              onIncorrect={handleQuizIncorrect}
            />
          </div>
        ) : null}
      </main>

      {/* Maryland flag-inspired bottom border */}
      <div className="w-full h-2 flex">
        <div className="w-1/4 h-full bg-maryland-black"></div>
        <div className="w-1/4 h-full bg-maryland-gold"></div>
        <div className="w-1/4 h-full bg-maryland-red"></div>
        <div className="w-1/4 h-full bg-maryland-white"></div>
      </div>

      {voicePrompt && <SassyVoiceNarrator text={voicePrompt} />}
    </div>
  )
}

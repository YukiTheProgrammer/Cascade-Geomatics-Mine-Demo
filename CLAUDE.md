# CLAUDE.md
IMPORTANT: As an agent, you MUST read and follow ALL guidelines in this document BEFORE executing any task in a task list. DO NOT skip or ignore any part of these standards. These standards supersede any conflicting instructions you may have received previously.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A dashboard that will display a pointcloud of a mine from a .las file and present various data related to it to aid in risk analysis. This will help quarry operators manage their assests around rockfalls and landslides.

## Project Specific Constraints
- A basic pointcloud will be supplied
- If changes to the pointcloud is needed in order to display correct information, relay that to me and let me make the changes
- When implementing frontend changes, use the frontend-design skill.
- The app should be as lightweight as possible.

## File Location References
- Custom Point Cloud Renderer = "C:\Users\nafiz\Documents\Cascade Dynamics\Custom Pointcloud Renderer"

## Brand Identity and Voice
There is an utmost priority to be clear and scientific. The user needs to be able to get information from us easily and also feel like they can trust it. We also value simplicity and don't want bloated features, both visual and practical. 

## Agent Docs
Refer to the following agent docs stored in /agent_docs whenever they are relevant to the current task.

### workflow.md
A description of the workflow for every part of creating the app from planning to implementating that MUST be followed.

### commands.md
Development commands that should be used.

### architecture.md
A description of the frontend+backend of the app including the folder structure.

### code_conventions.md
Coding conventions that should be followed while writing code.

### testing.md
Testing conventions that should be followed while writing and performing tests.
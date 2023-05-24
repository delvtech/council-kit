# Council Contributor Guide

Building Council couldn’t have been possible without the feedback and support from our community! We strive to make Council better and would love to see community submissions to improve the quality of the codebase and extend its core capabilities.

## Quick Start
* Clone this repository on your local environment
* Follow the installation & build steps in the [README](https://github.com/delvtech/council-kit#readme)
* Browse the ['Backlog' view](https://github.com/orgs/delvtech/projects/7/views/1) of the Council GitHub Project

## Contributor Roles

### Contributor
Anybody can become a Contributor by requesting to be assigned to an issue and subsequently opening a PR. Contributors can request to be assigned to an issue by leaving a comment on it. You can view issues by release using the ['Milestones' view](https://github.com/orgs/delvtech/projects/7/views/5) in the Council GitHub project.

### Maintainer
Initially, the Delv team will act as the maintainer for this project. Avid contributors can apply to be a Maintainer and would be expected to show active engagement with the project, including:
* Reviewing and approving PRs
* Answering questions that contributors send through the appropriate channels
* Populating the “Screen” project board with feature requests that come through Discord directly as GitHub Issues
* Gatekeep GitHub issues moving them from “Screen” to “Backlog” status
* Maintainers may join product strategy calls where discussions are long-term focused and could include changes to process, templates, PR review criteria, etc.
 
 
## Contribution Process

### Terminology

| Name | Description |
| -------- | -------- |
| **Draft**     | An item added directly to the ‘Council’ GitHub project (‘Screen’ or ‘Backlog’ column) that has not yet been converted to an issue |
| **Issue**     | An issue (aka Task) that has been assigned to a Release (i.e., a Milestone) |

### New Issues

Anyone can request features, improvements, bug fixes, and any other changes to the code through [Delv’s Discord server](https://discord.gg/tQC6jzHn) or by [submitting an issue](https://github.com/delvtech/council-kit/issues) to the council-kit GitHub repository.

Maintainers will monitor these channels and add them to the repository’s GitHub Project, thus initiating the issue lifecycle. New ideas and requests are triaged by maintainers on an ongoing basis.

**Issue Labels:**
* UI
* Docs
* SDK
* CLI
* Deploy
* Protocol (only added from the ‘Council’ contracts repo)

**Issue Modifier Labels:**
* Bug
* Good First Issue
* Enhancement

## Issue Lifecycle

**🧐 Screen → 📋 Backlog → 🔖 Ready → 🏗 In Progress → 👀 In review → ✅ Done  |  🚫 Won’t Do**

| #  |          Status          |    Description      |
| - | ------------------ | -------- |
| 1 | 🧐 **Screen**      | New Drafts or Issues awaiting triage by a Maintainer     |
| 2 | 📋 **Backlog**     | Drafts or Issues that have been screened by a Maintainer and accepted as Tasks for future development     |
| 3 | 🔖 **Ready**       | Issues (including any Drafts that were converted to Issues) that have been selected for the next release and are ready to be worked on by Maintainers and Contributors     |
| 4 | 🏗 **In Progress** | Issues that have been assigned to a Contributor and are currently being worked on     |
| 5 | 👀 **In review**   | Issues that are ready for review by a Maintainer     |
| 6 | ✅ **Done**        | Issues that have been completed, reviewed, and merged into the codebase     |
| 6 | 🚫 **Won’t Do**    | Feature requests, improvements, or issues that have been rejected     |

##
**Screening phase**: 🧐 **Screen** → 📋 **Backlog**

Once Maintainers have screened drafts and issues, their individual statuses will be updated:
* Accepted ideas are moved into the ‘Backlog’ to be considered in the next release planning call.
* Rejected ideas are archived to the ‘Won’t Do’ column or deleted if the idea has been rejected previously.

Discussion can happen async in Discord or within the open drafts or issues themselves.

##
**Release planning:** 📋 **Backlog** → 🔖 **Ready**

Release planning calls are held periodically (quarterly to start) to review the Backlog, resulting in a set of issues being assigned to the next release (tagged with a specific Milestone in GitHub).

Contributors may get an early start on open issues marked for future releases, but any opened PRs won’t be merged until a future release containing that issue begins (exceptions are possible).

Once the current release is shipped (versions updated, release notes and GitHub tag added), issues in the ‘Backlog’ prioritized for the next release are moved to the ‘Ready’ column.

##
**Development phase:** 🔖 **Ready** → 🏗 **In Progress** → 👀 **In review**

As a contributor, you can ask to be assigned an Issue from the ‘Ready’ column by leaving a comment on it. Issues that have been assigned to Contributors will immediately have their status changed to ‘In Progress’.

Once you’ve started working on your assigned issue, you can open a PR against the main branch with the [WIP] flag in the PR name. Confirm that your PR targets the ‘main’ branch.

After your code is ready for review, please remove the [WIP] tag and submit the PR for review. The GitHub repository is configured to perform the following checks on your PR:
* properly formatted with Prettier (yarn format:check)
* passes lint check (yarn lint)
* builds (yarn build)

## Shipping

Once your PR passes all the checks, a Maintainer will review it and either request more changes (moving the issue back to ‘In Progress’ if necessary), or approve it and move the issue to the ‘Done’ column.

All PRs will need to be reviewed by a Maintainer before being squashed and merged. Please note, Maintainers will likely be busy and thus for some PRs it may take several weeks for review; we ask you to remain patient and respectful throughout that process. Once all issues from the current release are completed, the versions will be updated, a new version tag created, and a GitHub release created for the new version.

## Planning and Coordination for Releases

Changes to the code will be pushed to production through releases, which group sets of issues that have been prioritized by the Council project Maintainers based on factors such as impact, size, collaboration cost, confidence score, and available resources.

Release planning community calls will be scheduled by Maintainers and will be open to all Contributors. These calls will be recorded. Once the Release is set, sprint planning will follow. Sprints will typically run for 2-3 weeks each, breaking the planned release up into smaller chunks with demos at the conclusion of each.

Release planning is a soft lock on the next set of features/improvements to be shipped, however, new high priority issues that surface during a release could result in backlog grooming and slight reprioritization of the current release (i.e., items in the ‘Ready’ column) potentially leading to some issues being bumped to the next release (a given for bugs).
 
## Release Types:

|    Type Name              |    Description                |
| ---------------- | ------------------ |
| **Patch:** v0.0.**x** | no breaking changes, no new features |
| **Minor:** v0.**x**.0 | backwards compatible, no breaking changes, new features |
| **Major:** v**x**.0.0 | breaking change, new way to use kit that will not work with old code |
 
##
# Code of Conduct
We maintain a polite and respectful development community and one which is welcoming of people from all backgrounds. As such, we invite all those who participate in our community to help us foster a safe and positive experience for everyone. We expect our community members to treat their peers with respect. Harassment of any kind, including racism, hate speech, harmful language, etc., will NOT be tolerated. If your behavior is not in line with these community expectations, you will be removed from community discussions and lose any review abilities or other community standings which have been entrusted to you.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Released]

v1.7.1 - 2023-08-19

### Added

- Added a new questionnaire: FIM

### Changed

- Numeric values will be checked for validity (not string) and will be converted to numbers if nessesary

### Fixed

- Fixed a bug, that if different questionnaires were stored from within different tabs, some data got lost

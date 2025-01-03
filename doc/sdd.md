# Software Design Document
## Overview
This document provides information regarding the technical specifications of the **beatattoos** e-commerce project. It defines the architecture, design, components, security, testing and quality assurance of the project. For product requirements, please refer to the [Product Requirement Document](prd.md).
## System Architecture
### Overview
- **Frontend**: handles the user interface and client-side logic
- **Backend**: manages the server-side logic, API requests, and database interactions
- **Shared**: contains the visual components and business logic shared between the application components
- **Storage**: stores and retrieves all application data
### Component Diagram
Here is a [link](https://www.figma.com/board/e1gJpss6BXzyHw2XSj0wo5/System-Architecture?node-id=40000003-347&t=3IJcEw2DDfQnVC3T-4) to the **beatattoos** system architecture diagram
## User Interface
### Design System
[Design system](https://www.figma.com/design/NKFhgn4TKEaUyLy72z8yyt/User-Interface?node-id=297-1367&t=mvOEQwcOuLHUznJo-1)
### Admin
#### Registration Process
As a tattoo artist (admin), I want to register with my email address and password during the initial setup so that I can create an account with access to the admin website
##### GitHub Issue
[Registration user story](https://github.com/gretron/beatattoos/issues/79)
##### Wireframe
[Registration wireframe](https://www.figma.com/design/NKFhgn4TKEaUyLy72z8yyt/User-Interface?node-id=297-1367&t=mvOEQwcOuLHUznJo-1)
##### Mockup
[Registration mockup](https://www.figma.com/design/NKFhgn4TKEaUyLy72z8yyt/User-Interface?node-id=297-1295&t=mvOEQwcOuLHUznJo-1)
#### Log In Process
As a tattoo artist (admin), I want to log in with my email address and password so that I can access the administrator website
##### GitHub Issue
[Log in user story](https://github.com/gretron/beatattoos/issues/47)
##### Wireframe
[Log in wireframe](https://www.figma.com/design/NKFhgn4TKEaUyLy72z8yyt/User-Interface?node-id=431-1141&t=JHX4SQlmPSdjdbt5-1)
##### Mockup
[Log in mockup](https://www.figma.com/design/NKFhgn4TKEaUyLy72z8yyt/User-Interface?node-id=431-1301&t=JHX4SQlmPSdjdbt5-1)
#### Create Client Process
As a tattoo artist (admin), I want to create client accounts so that I can make accounts for in-person clients
##### GitHub Issue
[Create client user story](https://github.com/gretron/beatattoos/issues/96)
##### Wireframe
[Create client wireframe](https://www.figma.com/design/NKFhgn4TKEaUyLy72z8yyt/User-Interface?node-id=443-1663&t=aohwIXTnZElIM6Ye-1)
##### Mockup
[Create client mockup](https://www.figma.com/design/NKFhgn4TKEaUyLy72z8yyt/User-Interface?node-id=456-5108&t=aohwIXTnZElIM6Ye-1)
#### View Client Details Process
As a tattoo artist (admin), I want to view client accounts so that I can be aware of client information
##### GitHub Issue
[View client details user story](https://github.com/gretron/beatattoos/issues/98)
##### Wireframe
[View client details wireframe](https://www.figma.com/design/NKFhgn4TKEaUyLy72z8yyt/User-Interface?node-id=500-2695&t=ruULLJFoaCrLk9HA-1)
##### Mockup
[View client details mockup](https://www.figma.com/design/TQ8gPI3f9OEMlvBOmeT38G/User-Interface?node-id=511-3963&t=szfgmmTLblLkeGsH-1)
### Client
#### Home Page Process
As a client, I want to view a homepage so that I can preview the tattoo artist's previous work and capabilities
##### GitHub Issue
[Home page user story](https://github.com/gretron/beatattoos/issues/101)
##### Wireframe
[Home page wireframe](https://www.figma.com/design/TQ8gPI3f9OEMlvBOmeT38G/User-Interface?node-id=643-3717&t=qD01OJABjC6fIOYW-1)
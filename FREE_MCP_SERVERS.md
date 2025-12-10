# Free MCP (Model Context Protocol) Servers - Comprehensive List

This document contains a comprehensive list of free and open-source MCP servers available on GitHub. MCP is an open protocol that enables AI assistants to securely interact with local and remote resources.

## Table of Contents
- [Official Reference Servers](#official-reference-servers)
- [Development & Code](#development--code)
- [Cloud Platforms & Infrastructure](#cloud-platforms--infrastructure)
- [Databases & Data Analytics](#databases--data-analytics)
- [Browser Automation](#browser-automation)
- [AI & Machine Learning](#ai--machine-learning)
- [File Systems & Storage](#file-systems--storage)
- [Communication & Collaboration](#communication--collaboration)
- [Web Search & Scraping](#web-search--scraping)
- [Financial & Cryptocurrency](#financial--cryptocurrency)
- [Media & Content](#media--content)
- [Healthcare & Bioinformatics](#healthcare--bioinformatics)
- [Security & Monitoring](#security--monitoring)
- [Art, Culture & Entertainment](#art-culture--entertainment)
- [Specialized Tools](#specialized-tools)

---

## Official Reference Servers

These are the official MCP reference servers from Anthropic:

| Server | Description | Repository |
|--------|-------------|------------|
| **Everything** | Reference/test server with prompts, resources, and tools | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Fetch** | Web content fetching and conversion for efficient LLM usage | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Filesystem** | Secure file operations with configurable access controls | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Git** | Tools to read, search, and manipulate Git repositories | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Memory** | Knowledge graph-based persistent memory system | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Sequential Thinking** | Dynamic and reflective problem-solving through thought sequences | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| **Time** | Time and timezone conversion capabilities | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |

---

## Development & Code

### Code Execution & Sandboxes

| Server | Description |
|--------|-------------|
| **node-code-sandbox-mcp** | Node.js MCP server that spins up isolated Docker-based sandboxes |
| **openapi-mcp** | Dockerized server for API access via OpenAPI documentation |
| **outsource-mcp** | Delegate AI tasks to other AI assistants |
| **PRIMS** | Python code execution in isolated environment |
| **openapi-to-mcp** | Access any API using OpenAPI specification |
| **pydantic-ai/mcp-run-python** | Python code execution in secure sandbox |
| **mcp-js** | JavaScript code execution sandbox using V8 |
| **mcp-server-js** | Execute any LLM-generated code in a secure and scalable sandbox environment |
| **container-use** | Containerized coding agent environments with git workflow |
| **E2B** | Secure cloud development environments for AI agents |
| **Microsandbox** | Self-hosted platform for secure AI code execution |

### Version Control

| Server | Description |
|--------|-------------|
| **GitHub MCP** (Official) | Official GitHub MCP server for repository management and API integration |
| **GitHub MCP** (Alternative) | Token-based GitHub automation with 80+ tools |
| **GitLab** | GitLab platform integration for project management |
| **Git** | Direct Git repository operations and analysis |
| **Phabricator** | Phabricator API integration for repositories |
| **Gitingest-MCP** | Gitingest integration for GitHub repo summaries |
| **GitKraken** | CLI with integrated MCP for git workflows and Jira |

### Coding Agents & Tools

| Server | Description |
|--------|-------------|
| **CodeGraphContext** | Index local code into graph database with visualizations |
| **mcp-server-leetcode** | Search and solve LeetCode problems |
| **codemcp** | Read, write, and command line tools for coding |
| **winx-code-agent** | High-performance Rust code agent implementation |
| **leetcode-mcp-server** | Automated LeetCode problem and solution access |
| **vscode-mcp-server** | Read VS Code workspace structure and linter issues |
| **code-to-tree** | Convert source code into AST regardless of language |
| **serena** | Fully-featured coding agent using language servers |
| **RepoMapper** | Dynamic repository map with function prototypes |
| **Agent-MCP** | Full-featured Python coding agent |
| **llm-context** | Share code context with LLMs via Model Context Protocol or clipboard |

### IDEs & Development Tools

| Server | Description |
|--------|-------------|
| **JetBrains** | Work on code with JetBrains IDEs |
| **Playwright MCP** | Browser automation capabilities and accessibility snapshots |
| **Semgrep** | Code security analysis |
| **NuGet MCP** | Advanced tooling scenarios for package management automation |

---

## Cloud Platforms & Infrastructure

### AWS

| Server | Description |
|--------|-------------|
| **AWS Core** | AWS service integration tools and best practices |
| **AWS CDK** | CDK advice, Nag rules, and AWS Solutions patterns |
| **aws-mcp-server** | AWS CLI command execution in Docker |
| **mcp-server-aws-sso** | AWS Single Sign-On integration |
| **aws-pricing-mcp** | Up-to-date EC2 pricing information |
| **LocalStack** | Local AWS environment management |

### Azure

| Server | Description |
|--------|-------------|
| **Azure MCP** | All Azure MCP tools in a single server for AI agents and Azure services |
| **Azure DevOps MCP** | Wide-ranging Azure DevOps tasks from code editors |
| **Azure Kubernetes Service** | Bridges AI assistants with AKS clusters for natural language operations |
| **Azure Data Lake Storage** | Azure Data Lake Storage operations |
| **Azure Resource Graph** | Azure resource queries at scale |
| **Azure CLI MCP** | Azure CLI command wrapper |
| **Microsoft Dev Box** | Developer-focused operations for environment management |

### Microsoft Services

| Server | Description |
|--------|-------------|
| **Microsoft Fabric** | Comprehensive access to Fabric's public APIs and item definitions |
| **Microsoft Foundry** | Unified tools for models, knowledge, and evaluation |
| **Microsoft 365** | Graph API integration (mail, files, Excel, calendar) |
| **Microsoft Clarity** | Fetch analytics data from Clarity |
| **Microsoft Dataverse** | Natural language queries over business data with CRUD operations |
| **Microsoft Learn** | AI assistant with real-time access to official Microsoft documentation |
| **Microsoft SQL** | Conversational database interactions across on-premises and cloud |

### Kubernetes

| Server | Description |
|--------|-------------|
| **k8s-mcp-server** (multiple implementations) | Kubernetes pod, deployment, service operations |
| **kubectl-mcp-server** | Natural language Kubernetes interaction |
| **manusa/Kubernetes MCP** | Powerful Kubernetes MCP server with OpenShift support |
| **k8m** | Multi-cluster Kubernetes management with 50+ tools |
| **kom** | Multi-cluster Kubernetes as SDK integration |
| **mcp-k8s-eye** | Kubernetes management and cluster analysis |
| **cyclops-ui/mcp-cyclops** | Kubernetes resource management through Cyclops |
| **cert-manager-mcp-server** | cert-manager management and troubleshooting |
| **StacklokLabs/mkp** | Kubernetes interaction for LLM applications |

### Other Cloud Platforms

| Server | Description |
|--------|-------------|
| **Cloudflare** | Workers, KV, R2, D1 integration |
| **Google Cloud Run** | Serverless deployment |
| **Render** | Service deployment and database queries |
| **Pulumi** | Infrastructure management and deployment |
| **Terraform (tfmcp)** | Terraform environment management in Rust |
| **Alibaba Cloud Ops** | Alibaba Cloud resource operations |
| **OpenStack** | OpenStack cloud infrastructure |
| **Portainer** | Portainer instance container management |
| **PythonAnywhere** | PythonAnywhere cloud platform |
| **Qiniu Cloud** | Qiniu Cloud Storage and media services |
| **Nutanix** | Nutanix Prism Central resource interface |
| **4everland-hosting** | Deploy to decentralized storage (Greenfield, IPFS, Arweave) |

### Container & Virtualization

| Server | Description |
|--------|-------------|
| **Docker** | Docker operations and container management |
| **VMware ESXi** | VMware ESXi/vCenter management |
| **OCI Registry** | OCI registry container image operations |
| **Tilt** | Tilt development environment access |

---

## Databases & Data Analytics

### Relational Databases

| Server | Description |
|--------|-------------|
| **PostgreSQL** | Read-only database access with schema inspection |
| **MySQL** | Configurable access controls and schema inspection |
| **Microsoft SQL** | Conversational database interactions |
| **SingleStore** | Database platform interaction |
| **TiDB** | Serverless database integration |

### NoSQL & Vector Databases

| Server | Description |
|--------|-------------|
| **MongoDB** | Collection querying and analysis |
| **MongoDB Lens** | Full featured MCP Server for MongoDB databases |
| **Redis** | Efficient management and search data in Redis |
| **Redis Cloud** | Redis Cloud resource management |
| **Couchbase** | Natural language querying of clusters |
| **Qdrant** | Vector search engine memory management |
| **Milvus** | Search and query vector database data |
| **Neo4j** | Graph database schema and Cypher operations |

### Data Platforms

| Server | Description |
|--------|-------------|
| **DuckDB** | Schema inspection and query support |
| **MotherDuck** | Query and analyze with MotherDuck/DuckDB |
| **SQLite** | Database operations with analysis features |
| **ClickHouse** | Query ClickHouse database servers |
| **Snowflake** | Read/write capabilities with insight tracking |
| **BigQuery** | Schema inspection and SQL queries |
| **Neon** | Interact with Postgres serverless platform |
| **Supabase** | Database, auth, and edge functions |
| **Airtable** | Read and write access with schema inspection |
| **NocoDB** | Read and write access to NocoDB |
| **DBUtils** | Unified PostgreSQL and SQLite access layer |
| **Excel** | Workbook manipulation and data management |

### Data Processing

| Server | Description |
|--------|-------------|
| **dbt** | Data transformation and semantic layer |
| **Unstructured** | Data processing workflows |
| **Microsoft Fabric Real-Time Intelligence** | AI agents interact with RTI services for data analysis |

---

## Browser Automation

| Server | Description |
|--------|-------------|
| **Playwright** (Official Microsoft) | Browser automation with accessibility snapshots |
| **Puppeteer** | Browser automation via Puppeteer |
| **browser-use-rs** | Lightweight browser automation in Rust with zero dependencies |
| **mcp-server-browserbase** | Cloud-based browser automation and data extraction |
| **browsermcp/mcp** | Automate local Chrome browser |
| **browser-use-mcp-server** | Browser-use with SSE transport and Docker support |
| **browser-control-mcp** | Firefox browser control via extension |
| **firefox-devtools-mcp** | Firefox automation with WebDriver BiDi |
| **mcp-aoai-web-browsing** | Minimal server/client with Azure OpenAI and Playwright |
| **gomcp** | Lightpanda headless browser for web automation |
| **mcp-browser-kit** | Interact with local browsers |
| **web-eval-agent** | Autonomously debug web applications |
| **selenium-mcp-server** | Web automation via Selenium WebDriver |
| **mcp-browser-agent** | Autonomous browser automation for Claude Desktop |

---

## AI & Machine Learning

| Server | Description |
|--------|-------------|
| **Comet Opik** | Query and analyze LLM telemetry data |
| **Logfire** | OpenTelemetry traces and metrics access |
| **Token Metrics** | Crypto trading signals and analytics |
| **Pydantic AI** | Python code execution with validation |

---

## File Systems & Storage

### Cloud Storage

| Server | Description |
|--------|-------------|
| **Google Drive** | File access, search, and management |
| **Box** | Seamless Box content access for AI agents |
| **Microsoft OneDrive** | OneDrive file access via Microsoft 365 integration |
| **IPFS** | IPFS storage upload and manipulation |

### File System Operations

| Server | Description |
|--------|-------------|
| **Filesystem** (Official) | Direct local file system access |
| **Filesystem** (Golang) | Golang implementation for local file system operations |
| **fast-filesystem-mcp** | Advanced filesystem operations with large file handling |
| **Everything Search** | Lightning-fast Windows file search using Everything SDK |
| **Backup** | File and folder backup and restoration capabilities |
| **FileStash** | Remote storage access (SFTP, S3, FTP, SMB, NFS, WebDAV, GIT, etc.) |

### Video & Media Storage

| Server | Description |
|--------|-------------|
| **VideoDB** | Serverless video database with AI tagging and transcription |
| **VideoDB Director** | AI-powered video workflow automation |
| **Mux** | Video API and streaming management |

---

## Communication & Collaboration

| Server | Description |
|--------|-------------|
| **Slack** | Official Slack server for channel management and messaging |
| **Notion** | Official Notion server for workspace access |
| **Atlassian** | Interact with Jira work items and Confluence pages |
| **Linear** | Issue tracking system integration |
| **LINE Official Account** | Connects AI agents to LINE messaging |
| **Carbon Voice** | Voice messages, conversations, and AI actions |
| **ntfy** | Notification sending to self-hosted ntfy.sh servers |
| **Apple Shortcuts** | Apple Shortcuts integration |
| **Apple Reminders** | macOS Apple Reminders interaction |

---

## Web Search & Scraping

| Server | Description |
|--------|-------------|
| **Exa** | Search Engine made for AIs with semantic queries |
| **Tavily** | Search engine designed for AI agents |
| **Firecrawl** | Web data extraction and content crawling |
| **BrowserBase** | Cloud browser automation and scraping |
| **olostep-mcp-server** | Web scraping, crawling, and search API. Extract content in Markdown/JSON |
| **web-search** | Free web searching using Google with no API keys |
| **ashra-mcp** | Extract structured data from websites as JSON |
| **Apify** | Extract data from websites using 6,000+ pre-built cloud tools |

---

## Financial & Cryptocurrency

| Server | Description |
|--------|-------------|
| **Stripe** | Payment processing API interaction |
| **PayPal** | Payment integration and transactions |
| **Square** | Point-of-sale and payment tools |
| **Twilio** | SMS, calls, and account management |
| **CoinGecko** | Crypto price and market data |
| **Twelve Data** | Real-time financial market data |
| **Token Metrics** | Crypto trading signals and analytics |
| **Bankless Onchain** | Query blockchain transaction data |

---

## Media & Content

### Video

| Server | Description |
|--------|-------------|
| **YouTube (yutu)** | YouTube automation operations |
| **YouTube Transcript** | YouTube subtitles and transcripts |
| **Bilibili** (multiple implementations) | Bilibili content searching and trending videos |
| **DaVinci Resolve** | DaVinci Resolve video editing and grading |
| **video-editing-mcp** | Video analysis and editing from collection |

### Audio & Music

| Server | Description |
|--------|-------------|
| **ElevenLabs** | Text-to-speech generation |
| **Discogs** | Discogs API for music database access |
| **fal-mcp-server** | Generate AI images, videos, and music using Fal.ai |

### Documents

| Server | Description |
|--------|-------------|
| **Inkeep** | RAG search over documentation |
| **Graphlit** | Multi-source content ingestion |
| **Markitdown** | Specialized server for Markdown processing |

---

## Healthcare & Bioinformatics

| Server | Description |
|--------|-------------|
| **onekgp-mcp** | Natural language access to 1000 Genomes Project |
| **biomcp** | PubMed, ClinicalTrials.gov, and MyVariant.info access |
| **ucsc-genome-mcp** | UCSC Genome Browser API interaction |
| **biothings-mcp** | BioThings API for genes, variants, drugs |
| **gget-mcp** | Bioinformatics toolkit for genomics queries |
| **opengenes-mcp** | Aging and longevity research database |
| **synergy-age-mcp** | SynergyAge genetic interactions database |
| **FHIR MCP** | Connect AI agents to FHIR healthcare servers |
| **medical-mcp** | Medical information and drug database access |
| **apple-health-mcp-server** | Apple Health exported data analytics |
| **omop_mcp** | Map clinical terminology to OMOP concepts |

---

## Security & Monitoring

| Server | Description |
|--------|-------------|
| **Semgrep** | Code security analysis |
| **Sentry** | Error tracking and performance monitoring |
| **Grafana** | Dashboard and incident investigation |
| **Raygun** | Crash reporting and user monitoring |
| **sslmon** | Domain and SSL certificate monitoring |
| **Metoro** | Query Kubernetes environments |
| **Netskope** | Netskope Private Access management |
| **Auth0** | Create and modify actions, applications, forms, and logs |
| **Wassette** | Security-oriented runtime that runs WebAssembly Components via MCP |

---

## Art, Culture & Entertainment

### 3D & Design

| Server | Description |
|--------|-------------|
| **Blender MCP** | MCP server for Blender 3D software |
| **Maya MCP** | Autodesk Maya integration |
| **Aseprite MCP** | Create pixel art using Aseprite API |
| **SVGMaker MCP** | AI-driven SVG generation via natural language |
| **OctoPrint MCP** | 3D printer state and control access |
| **Isaac Sim MCP** | Natural language control of NVIDIA Isaac Sim |

### Animation & Video

| Server | Description |
|--------|-------------|
| **Manim MCP** | Generate animations using Manim |

### Museums & Culture

| Server | Description |
|--------|-------------|
| **Metropolitan Museum** | Metropolitan Museum artwork collection search |
| **Smithsonian** | Smithsonian Institution Open Access collections |
| **Rijksmuseum** | Rijksmuseum artwork search and collections |
| **oorlogsbronnen-mcp** | WWII historical records from Netherlands |

### Books & Media

| Server | Description |
|--------|-------------|
| **Open Library** | Open Library API for book information searches |
| **Books MCP** | Book querying and information |
| **The Movie Database** | Movie Database API integration for film and TV information |
| **AniList MCP** | AniList API for anime and manga information |

### Other

| Server | Description |
|--------|-------------|
| **Quran MCP** | Quran.com corpus access via REST API |
| **Bazi MCP** | Chinese Astrology charting and analysis |
| **Mermaid MCP** | AI-powered Mermaid diagram generation with 22+ diagram types |

---

## Specialized Tools

### Aggregators & Orchestration

| Server | Description |
|--------|-------------|
| **1mcp/agent** | Unified Model Context Protocol server aggregating multiple MCP servers |
| **roundtable** | Unifies multiple AI coding assistants through standardized MCP interface |
| **MCPJungle** | Self-hosted MCP Server registry for enterprise AI Agents |
| **mcpmcp-server** | Lists available MCP servers for workflow improvement |
| **anyquery** | Query 40+ apps with SQL; local-first design |
| **neurolink** | Edge-first platform unifying 12 providers and 100+ models |
| **metatool-app** | MetaMCP middleware managing MCP connections with GUI |
| **MindsDB** | Connect and unify data across platforms and databases |
| **NCP** | Orchestrates MCP ecosystem through intelligent discovery |
| **Pipedream** | Connect 2,500 APIs with 8,000+ prebuilt tools |
| **magg** | Universal hub allowing LLMs to autonomously discover and install MCP servers |
| **mcpbundles** | Create custom tool bundles with OAuth or API keys |
| **open-mcp** | Turn web APIs into MCP servers in 10 seconds |

### Aerospace

| Server | Description |
|--------|-------------|
| **IO-Aerospace MCP** | .NET-based MCP server for aerospace & astrodynamics — ephemeris, orbital conversions, DSS tools |

### Travel & Experience

| Server | Description |
|--------|-------------|
| **peek-travel/mcp-intro** | Experience discovery and planning platform |

### IoT & Hardware

| Server | Description |
|--------|-------------|
| **ESP RainMaker** | ESP RainMaker device management |
| **OctoPrint** | 3D printer state and control access |

### Podcast & Audio

| Server | Description |
|--------|-------------|
| **elementfm/mcp** | Open source podcast hosting platform |

### Search & Discovery

| Server | Description |
|--------|-------------|
| **Algolia** | Provision, configure, and query search indices |

### DevOps

| Server | Description |
|--------|-------------|
| **Harness** | Pipeline and artifact management |
| **devops-mcp-webui** | Kubernetes with Open-WebUI integration |

### Other Platforms

| Server | Description |
|--------|-------------|
| **Liveblocks** | Liveblocks room and collaboration management |
| **NebulaBlock** | NebulaBlock API integration |
| **Kestra** | Kestra workflow orchestration |

---

## Resources & Getting Started

### Official Documentation
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Examples](https://modelcontextprotocol.io/examples)

### Awesome Lists (Curated Collections)
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) - Official reference servers
- [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - Production-ready and experimental servers
- [wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) - Comprehensive curated list
- [appcypher/awesome-mcp-servers](https://github.com/appcypher/awesome-mcp-servers) - Community-maintained collection
- [habitoai/awesome-mcp-servers](https://github.com/habitoai/awesome-mcp-servers) - MCP implementations for external data sources
- [TensorBlock/awesome-mcp-servers](https://github.com/TensorBlock/awesome-mcp-servers) - Comprehensive collection (7260+ servers)
- [MobinX/awesome-mcp-list](https://github.com/MobinX/awesome-mcp-list) - Concise list for MCP servers
- [PipedreamHQ/awesome-mcp-servers](https://github.com/PipedreamHQ/awesome-mcp-servers) - Collection by Pipedream
- [rohitg00/awesome-devops-mcp-servers](https://github.com/rohitg00/awesome-devops-mcp-servers) - DevOps-focused MCP servers

### Official Repositories
- [Microsoft MCP](https://github.com/microsoft/mcp) - Microsoft's official MCP server implementations
- [GitHub MCP Server](https://github.com/github/github-mcp-server) - GitHub's official MCP Server

---

## Key Features of MCP Servers

Most MCP servers provide the following capabilities:

1. **Natural Language Integration** - Interact with services using natural language
2. **Secure Access** - Authentication and authorization handling
3. **Real-time Data** - Access to live data from external sources
4. **Tool Integration** - Seamless integration with existing development workflows
5. **API Abstraction** - Simplified access to complex APIs
6. **Read/Write Operations** - Both query and modification capabilities
7. **Open Source** - Free to use, modify, and contribute

---

## Installation & Usage

Most MCP servers can be installed via:

- **npm** - For Node.js/TypeScript servers
- **pip** - For Python servers
- **Docker** - For containerized servers
- **Native binaries** - For Go/Rust servers

Refer to individual repository documentation for specific installation instructions.

---

## Contributing

This list is compiled from multiple sources including:
- Official Model Context Protocol repositories
- Community-maintained awesome lists
- Microsoft's MCP catalog
- GitHub's public repositories

To add or update servers, please refer to the original awesome-mcp-servers repositories listed above.

---

**Last Updated**: December 10, 2025
**Total Servers Listed**: 300+

All servers listed are free and open-source unless otherwise noted.

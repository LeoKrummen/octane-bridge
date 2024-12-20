# Octane Bridge - System Architecture and Development Plan

## Project Overview
Octane Bridge provides a modern, web-based shader library for Octane Render users. Unlike traditional 3D software plugins that force users to browse content through limiting in-application interfaces, Octane Bridge offers a superior user experience by combining a polished web application for browsing and managing shaders with seamless one-click imports directly into Blender. 

The system consists of three main components:
1. A modern web application for browsing, previewing, and managing shaders
2. A lightweight Blender plugin that handles imports and maintains connection state
3. A bundled local bridge server that securely connects the web application to Blender

This architecture ensures users can discover and manage shaders through a sophisticated web interface while maintaining the convenience of direct Blender integration. Access is provided through a subscription-based model managed via Stripe.

## User Experience Flow

1. **Installation**
   - User installs Blender plugin through standard addon manager
   - Plugin automatically sets up bundled local bridge server
   - No separate installation steps required

2. **Browsing Shaders**
   - User clicks "Browse Shader Library" button in Blender
   - System browser opens to web application
   - User logs in if needed
   - User browses shaders through modern web interface

3. **Importing Shaders**
   - User clicks "Import" button on web interface
   - Web app validates subscription
   - Import triggers automatically in Blender
   - User receives real-time status updates

## System Architecture

### Core Components

1. **Web Application (Next.js)**
   - Modern, responsive interface for shader browsing
   - Advanced search and filtering
   - High-quality shader previews
   - Real-time import status updates
   - User authentication and subscription management
   - Built with:
     - Next.js with TypeScript
     - shadcn/ui components
     - Tailwind CSS
     - Hosted on Vercel
     - Stripe Elements for payment UI
   - Error tracking (Sentry)
   - Performance monitoring (Datadog)

2. **Blender Plugin**
   - Minimal UI (single "Browse Library" button)
   - Bundled bridge server management
   - Import handling
   - Status monitoring
   - Cache management
   - Auto-updates
   - Error recovery

3. **Local Bridge Server**
   - Bundled with Blender plugin
   - Dynamic port selection
   - CORS configuration for localhost
   - Token validation
   - Shader caching
   - Import coordination
   - Auto-start/stop with Blender

4. **Authentication & Database (Supabase)**
   - User authentication
   - Shader library database
   - Subscription tracking
   - Row Level Security (RLS)
   - Real-time status updates

5. **Payment Processing (Stripe)**
   - Subscription management
   - Payment processing
   - Webhook integration
   - Customer portal

6. **Storage (AWS S3)**
   - Shader file storage
   - Preview image hosting
   - CDN integration
   - Secure file distribution

### Communication Flow

1. **Browse Flow**
   ```mermaid
   sequenceDiagram
       participant Blender
       participant Browser
       participant WebApp
       participant API
       
       Blender->>Browser: Open shader library
       Browser->>WebApp: Load application
       WebApp->>API: Authenticate user
       API->>WebApp: Return session
       WebApp->>API: Fetch shaders
       API->>WebApp: Return shader library
   ```

2. **Import Flow**
   ```mermaid
   sequenceDiagram
       participant WebApp
       participant API
       participant LocalServer
       participant Blender
       
       WebApp->>API: Request import token
       API->>WebApp: Return signed token
       WebApp->>LocalServer: Send import request + token
       LocalServer->>API: Validate token & subscription
       API->>LocalServer: Return validation + shader URL
       LocalServer->>LocalServer: Cache shader
       LocalServer->>Blender: Trigger import
       LocalServer->>WebApp: Return status
   ```

### Security Implementation

1. **Cross-Origin Security**
   - Local server only accepts localhost connections
   - CORS headers for web application
   - Token-based request validation
   - Short-lived import tokens

2. **Import Security**
   - HMAC-signed tokens for import requests
   - Subscription validation on each import
   - File integrity verification
   - Secure shader caching

[Database Schema, Development Phases, and other sections remain largely the same as previous version...]

## Plugin Implementation

```python
class ShaderBridgeAddon(bpy.types.AddonPreferences):
    bl_idname = "octane_shader_bridge"
    
    def draw(self, context):
        layout = self.layout
        row = layout.row()
        row.operator("shader_bridge.browse_library", text="Browse Shader Library")

class BrowseLibrary(bpy.types.Operator):
    bl_idname = "shader_bridge.browse_library"
    bl_label = "Browse Shader Library"
    
    def execute(self, context):
        webbrowser.open(f"{WEB_APP_URL}?port={self.get_server_port()}")
        return {'FINISHED'}
    
    def get_server_port(self):
        return BundledServer.get_active_port()

class BundledServer:
    @staticmethod
    def ensure_running():
        """Start server if not running"""
        if not cls.is_running():
            cls.start()
    
    @staticmethod
    def get_active_port():
        """Return current server port"""
        return cls._active_port
```

## Development Priorities

1. **Phase 1: Core Experience (4 weeks)**
   - Web application UI/UX
   - Basic shader browsing
   - Simple import flow
   - Plugin foundation

2. **Phase 2: Integration (3 weeks)**
   - Local server implementation
   - Import token system
   - Basic error handling
   - Status updates

3. **Phase 3: Subscription (3 weeks)**
   - Stripe integration
   - Subscription validation
   - Usage tracking
   - Customer portal

4. **Phase 4: Polish (2 weeks)**
   - Enhanced error handling
   - Progress indicators
   - Auto-recovery
   - Performance optimization

5. **Phase 5: Launch (2 weeks)**
   - Testing
   - Documentation
   - Beta program
   - Production deployment


## Plugin Architecture

```python
class ShaderBridgePlugin:
    def __init__(self):
        self.server_manager = ServerManager()
        self.cache_manager = CacheManager()
        self.status_monitor = StatusMonitor()
        self.subscription_validator = SubscriptionValidator()
        
    def startup(self):
        # Auto-start server if not running
        if not self.server_manager.is_running():
            self.server_manager.start()
            
    def validate_environment(self):
        # Check all requirements are met
        return (self.server_manager.check_status() and 
                self.cache_manager.check_space() and
                self.status_monitor.check_connection())
                
    def import_shader(self, shader_id):
        try:
            # Validate subscription and download shader
            if not self.subscription_validator.validate():
                raise SubscriptionError("Invalid subscription")
                
            shader = self.cache_manager.get_shader(shader_id)
            if not shader:
                shader = self.download_shader(shader_id)
                
            return self.process_import(shader)
        except Exception as e:
            self.status_monitor.log_error(e)
            raise
```

## Monitoring and Analytics

1. **Error Tracking**
   - Sentry integration
   - Custom error reporting
   - User impact analysis
   - Error trending

2. **Performance Monitoring**
   - Datadog integration
   - Custom metrics
   - Alerting system
   - Dashboard creation

3. **Usage Analytics**
   - Import tracking
   - Subscription analytics
   - User behavior analysis
   - Feature usage metrics

4. **Health Checks**
   - Component status monitoring
   - Automated testing
   - Uptime tracking
   - Performance benchmarking

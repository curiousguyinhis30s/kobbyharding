import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, TrendingUp, Users, Clock, MapPin, 
  BarChart3, Monitor, Smartphone, AlertCircle,
  CheckCircle, XCircle, Wifi, WifiOff, Eye, MousePointer,
  RefreshCw
} from 'lucide-react'

// Types
interface Visitor {
  id: string
  sessionId: string
  ip: string
  country: string
  city: string
  browser: string
  device: string
  os: string
  referrer: string
  landingPage: string
  currentPage: string
  pages: string[]
  duration: number
  timestamp: string
  isActive: boolean
}

interface PageView {
  page: string
  views: number
  uniqueVisitors: number
  avgDuration: number
  bounceRate: number
  exitRate: number
}

interface HealthMetric {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  uptime: number
  responseTime: number
  lastCheck: string
  incidents: number
}

// interface HeatmapData {
//   page: string
//   clicks: Array<{ x: number; y: number; count: number }>
//   scrollDepth: number
//   avgTimeOnPage: number
// }

const AnalyticsDashboard = () => {
  
  const [timeRange, setTimeRange] = useState('24h')
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  // const [selectedMetric, setSelectedMetric] = useState('visitors')
  const [isLive, setIsLive] = useState(true)
  const [selectedPage, setSelectedPage] = useState('/collection')

  // Initialize with mock data
  useEffect(() => {
    generateMockData()
    trackVisitor()
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        updateMetrics()
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isLive])

  const trackVisitor = () => {
    // Real visitor tracking
    const visitor: Visitor = {
      id: Date.now().toString(),
      sessionId: `session_${Date.now()}`,
      ip: '192.168.1.1',
      country: getCountryFromTimezone(),
      city: getCityFromTimezone(),
      browser: getBrowser(),
      device: getDevice(),
      os: getOS(),
      referrer: document.referrer || 'Direct',
      landingPage: window.location.pathname,
      currentPage: window.location.pathname,
      pages: [window.location.pathname],
      duration: 0,
      timestamp: new Date().toISOString(),
      isActive: true
    }
    
    // Save to localStorage
    const existingVisitors = JSON.parse(localStorage.getItem('analytics_visitors') || '[]')
    localStorage.setItem('analytics_visitors', JSON.stringify([visitor, ...existingVisitors]))
  }

  const getBrowser = () => {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Other'
  }

  const getDevice = () => {
    const userAgent = navigator.userAgent
    if (/Mobile|Android|iPhone/i.test(userAgent)) return 'Mobile'
    if (/iPad|Tablet/i.test(userAgent)) return 'Tablet'
    return 'Desktop'
  }

  const getOS = () => {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Other'
  }

  const getCountryFromTimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const countryMap: { [key: string]: string } = {
      'America/New_York': 'United States',
      'America/Los_Angeles': 'United States',
      'Europe/London': 'United Kingdom',
      'Europe/Paris': 'France',
      'Asia/Tokyo': 'Japan',
      'Asia/Shanghai': 'China'
    }
    return countryMap[timezone] || 'Unknown'
  }

  const getCityFromTimezone = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const city = timezone.split('/').pop()?.replace(/_/g, ' ')
    return city || 'Unknown'
  }

  const generateMockData = () => {
    // Mock visitors
    const mockVisitors: Visitor[] = Array.from({ length: 50 }, (_, i) => ({
      id: `visitor_${i}`,
      sessionId: `session_${i}`,
      ip: `192.168.1.${i}`,
      country: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'][i % 6],
      city: ['New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris'][i % 6],
      browser: ['Chrome', 'Safari', 'Firefox', 'Edge'][i % 4],
      device: ['Desktop', 'Mobile', 'Tablet'][i % 3],
      os: ['Windows', 'macOS', 'iOS', 'Android'][i % 4],
      referrer: ['Google', 'Direct', 'Facebook', 'Instagram'][i % 4],
      landingPage: ['/welcome', '/collection', '/piece/1'][i % 3],
      currentPage: ['/collection', '/cart', '/checkout'][i % 3],
      pages: ['/welcome', '/collection', '/piece/1', '/cart'],
      duration: Math.floor(Math.random() * 600),
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      isActive: i < 10
    }))
    setVisitors(mockVisitors)

    // Mock page views
    const mockPageViews: PageView[] = [
      { page: '/welcome', views: 1234, uniqueVisitors: 892, avgDuration: 45, bounceRate: 32, exitRate: 28 },
      { page: '/collection', views: 2456, uniqueVisitors: 1567, avgDuration: 120, bounceRate: 25, exitRate: 35 },
      { page: '/piece/*', views: 3789, uniqueVisitors: 2134, avgDuration: 180, bounceRate: 20, exitRate: 45 },
      { page: '/cart', views: 987, uniqueVisitors: 654, avgDuration: 60, bounceRate: 15, exitRate: 25 },
      { page: '/checkout', views: 432, uniqueVisitors: 321, avgDuration: 240, bounceRate: 5, exitRate: 85 }
    ]
    setPageViews(mockPageViews)

    // Mock health metrics
    const mockHealth: HealthMetric[] = [
      { service: 'Website', status: 'healthy', uptime: 99.99, responseTime: 120, lastCheck: new Date().toISOString(), incidents: 0 },
      { service: 'API', status: 'healthy', uptime: 99.95, responseTime: 45, lastCheck: new Date().toISOString(), incidents: 1 },
      { service: 'Database', status: 'healthy', uptime: 99.98, responseTime: 12, lastCheck: new Date().toISOString(), incidents: 0 },
      { service: 'CDN', status: 'healthy', uptime: 100, responseTime: 8, lastCheck: new Date().toISOString(), incidents: 0 },
      { service: 'Payment', status: 'degraded', uptime: 98.5, responseTime: 450, lastCheck: new Date().toISOString(), incidents: 3 }
    ]
    setHealthMetrics(mockHealth)
  }

  const updateMetrics = () => {
    // Simulate real-time updates
    setVisitors(prev => {
      const updated = [...prev]
      // Update active visitor count
      const activeCount = Math.floor(Math.random() * 20) + 5
      updated.forEach((v, i) => {
        v.isActive = i < activeCount
        if (v.isActive) {
          v.duration += 5
          v.currentPage = ['/collection', '/cart', '/piece/1'][Math.floor(Math.random() * 3)]
        }
      })
      return updated
    })

    // Update health metrics
    setHealthMetrics(prev => prev.map(metric => ({
      ...metric,
      responseTime: metric.responseTime + (Math.random() - 0.5) * 10,
      lastCheck: new Date().toISOString()
    })))
  }

  const getActiveVisitors = () => visitors.filter(v => v.isActive).length
  // const getTotalVisitors = () => visitors.length
  const getAvgDuration = () => {
    const total = visitors.reduce((acc, v) => acc + v.duration, 0)
    return Math.round(total / visitors.length)
  }
  const getBounceRate = () => 25.4
  const getConversionRate = () => 3.2

  // Country distribution for geographic insights
  const getCountryDistribution = () => {
    const distribution: { [key: string]: number } = {}
    visitors.forEach(v => {
      distribution[v.country] = (distribution[v.country] || 0) + 1
    })
    return Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }

  // Generate heatmap data
  // const generateHeatmapData = (): HeatmapData => ({
  //   page: selectedPage,
  //   clicks: Array.from({ length: 50 }, () => ({
  //     x: Math.random() * 100,
  //     y: Math.random() * 100,
  //     count: Math.floor(Math.random() * 100)
  //   })),
  //   scrollDepth: 68,
  //   avgTimeOnPage: 145
  // })

  // Styles
  const containerStyle = {
    padding: '24px',
    background: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${'#e0e0e0'}`
  }

  const statCardStyle = {
    padding: '20px',
    background: '#d1d5db',
    border: `1px solid ${'#e0e0e0'}`,
    borderRadius: '8px',
    transition: 'all 0.3s'
  }

  const healthCardStyle = (status: string) => ({
    padding: '16px',
    background: '#d1d5db',
    border: `1px solid ${
      status === 'healthy' ? '#10b981' : 
      status === 'degraded' ? '#000000' : 
      '#ef4444'
    }`,
    borderRadius: '8px'
  })

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '300', 
            letterSpacing: '0.1em',
            color: '#000000',
            marginBottom: '8px'
          }}>
            ANALYTICS DASHBOARD
          </h2>
          <p style={{ color: '#666666', fontSize: '14px' }}>
            Real-time insights and website performance monitoring
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: isLive ? `${'#000000'}20` : 'transparent',
            border: `1px solid ${isLive ? '#000000' : '#e0e0e0'}`,
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onClick={() => setIsLive(!isLive)}>
            {isLive ? <Wifi size={16} color={'#000000'} /> : <WifiOff size={16} />}
            <span style={{ fontSize: '13px', color: isLive ? '#000000' : '#666666' }}>
              {isLive ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: `1px solid ${'#e0e0e0'}`,
              borderRadius: '6px',
              color: '#000000',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          
          <button
            style={{
              padding: '8px',
              background: 'transparent',
              border: `1px solid ${'#e0e0e0'}`,
              borderRadius: '6px',
              color: '#666666',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={statCardStyle}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <Users size={20} color={'#000000'} />
            <div style={{
              padding: '2px 8px',
              background: '#10b98120',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#10b981'
            }}>
              +12.5%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '300', color: '#000000', marginBottom: '4px' }}>
            {getActiveVisitors()}
          </div>
          <div style={{ fontSize: '13px', color: '#666666' }}>
            Active Visitors
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={statCardStyle}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <Eye size={20} color={'#000000'} />
            <div style={{
              padding: '2px 8px',
              background: '#10b98120',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#10b981'
            }}>
              +8.3%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '300', color: '#000000', marginBottom: '4px' }}>
            {pageViews.reduce((acc, pv) => acc + pv.views, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: '#666666' }}>
            Page Views
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={statCardStyle}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <Clock size={20} color={'#000000'} />
            <div style={{
              padding: '2px 8px',
              background: '#000000' + '20',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#000000'
            }}>
              {getAvgDuration()}s
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '300', color: '#000000', marginBottom: '4px' }}>
            2:45
          </div>
          <div style={{ fontSize: '13px', color: '#666666' }}>
            Avg. Duration
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={statCardStyle}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <TrendingUp size={20} color={'#000000'} />
            <div style={{
              padding: '2px 8px',
              background: '#ef444420',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#ef4444'
            }}>
              -2.1%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '300', color: '#000000', marginBottom: '4px' }}>
            {getBounceRate()}%
          </div>
          <div style={{ fontSize: '13px', color: '#666666' }}>
            Bounce Rate
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          style={statCardStyle}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <BarChart3 size={20} color={'#000000'} />
            <div style={{
              padding: '2px 8px',
              background: '#10b98120',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#10b981'
            }}>
              +5.7%
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '300', color: '#000000', marginBottom: '4px' }}>
            {getConversionRate()}%
          </div>
          <div style={{ fontSize: '13px', color: '#666666' }}>
            Conversion Rate
          </div>
        </motion.div>
      </div>

      {/* Health Monitoring */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '300',
          letterSpacing: '0.1em',
          color: '#000000',
          marginBottom: '16px'
        }}>
          SYSTEM HEALTH
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {healthMetrics.map((metric) => (
            <motion.div
              key={metric.service}
              whileHover={{ scale: 1.02 }}
              style={healthCardStyle(metric.status)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#000000' }}>
                  {metric.service}
                </span>
                {metric.status === 'healthy' ? (
                  <CheckCircle size={16} color="#10b981" />
                ) : metric.status === 'degraded' ? (
                  <AlertCircle size={16} color={'#000000'} />
                ) : (
                  <XCircle size={16} color="#ef4444" />
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#666666' }}>Uptime</span>
                <span style={{ fontSize: '11px', color: '#666666' }}>{metric.uptime}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#666666' }}>Response</span>
                <span style={{ fontSize: '11px', color: '#666666' }}>{metric.responseTime}ms</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Geographic Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            color: '#000000',
            marginBottom: '16px'
          }}>
            VISITOR LOCATIONS
          </h3>
          <div style={{
            padding: '20px',
            background: '#d1d5db',
            border: `1px solid ${'#e0e0e0'}`,
            borderRadius: '8px'
          }}>
            {getCountryDistribution().map(([country, count], index) => (
              <div key={country} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: index < 4 ? `1px solid ${'#e0e0e0'}` : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={16} color={'#000000'} />
                  <span style={{ fontSize: '14px', color: '#000000' }}>{country}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '100px',
                    height: '8px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(count / visitors.length) * 100}%`,
                      height: '100%',
                      background: '#000000'
                    }} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#666666', minWidth: '40px' }}>
                    {count} ({Math.round((count / visitors.length) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            color: '#000000',
            marginBottom: '16px'
          }}>
            DEVICE BREAKDOWN
          </h3>
          <div style={{
            padding: '20px',
            background: '#d1d5db',
            border: `1px solid ${'#e0e0e0'}`,
            borderRadius: '8px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
              <div>
                <Monitor size={32} color={'#000000'} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '20px', fontWeight: '300', color: '#000000' }}>62%</div>
                <div style={{ fontSize: '12px', color: '#666666' }}>Desktop</div>
              </div>
              <div>
                <Smartphone size={32} color={'#000000'} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '20px', fontWeight: '300', color: '#000000' }}>31%</div>
                <div style={{ fontSize: '12px', color: '#666666' }}>Mobile</div>
              </div>
              <div>
                <Monitor size={32} color={'#000000'} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '20px', fontWeight: '300', color: '#000000' }}>7%</div>
                <div style={{ fontSize: '12px', color: '#666666' }}>Tablet</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Performance */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '300',
          letterSpacing: '0.1em',
          color: '#000000',
          marginBottom: '16px'
        }}>
          TOP PAGES
        </h3>
        <div style={{
          background: '#d1d5db',
          border: `1px solid ${'#e0e0e0'}`,
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${'#e0e0e0'}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#666666', fontWeight: '300' }}>PAGE</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#666666', fontWeight: '300' }}>VIEWS</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#666666', fontWeight: '300' }}>UNIQUE</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#666666', fontWeight: '300' }}>AVG TIME</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#666666', fontWeight: '300' }}>BOUNCE</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#666666', fontWeight: '300' }}>EXIT</th>
              </tr>
            </thead>
            <tbody>
              {pageViews.map((page, index) => (
                <tr key={page.page} style={{ borderBottom: index < pageViews.length - 1 ? `1px solid ${'#e0e0e0'}` : 'none' }}>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#000000' }}>{page.page}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: '#000000' }}>{page.views.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: '#666666' }}>{page.uniqueVisitors.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: '#666666' }}>{page.avgDuration}s</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: page.bounceRate > 30 ? '#000000' : '#666666' }}>{page.bounceRate}%</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '13px', color: '#666666' }}>{page.exitRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap Visualization */}
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '300',
          letterSpacing: '0.1em',
          color: '#000000',
          marginBottom: '16px'
        }}>
          CLICK HEATMAP
        </h3>
        <div style={{
          padding: '20px',
          background: '#d1d5db',
          border: `1px solid ${'#e0e0e0'}`,
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: `1px solid ${'#e0e0e0'}`,
                borderRadius: '6px',
                color: '#000000',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <option value="/welcome">Homepage</option>
              <option value="/collection">Collection</option>
              <option value="/piece">Product Page</option>
              <option value="/cart">Cart</option>
              <option value="/checkout">Checkout</option>
            </select>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MousePointer size={14} color={'#000000'} />
                <span style={{ fontSize: '12px', color: '#666666' }}>
                  Total Clicks: 4,892
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={14} color={'#000000'} />
                <span style={{ fontSize: '12px', color: '#666666' }}>
                  Scroll Depth: 68%
                </span>
              </div>
            </div>
          </div>
          
          {/* Heatmap Visualization Area */}
          <div style={{
            height: '300px',
            background: `linear-gradient(135deg, ${'#000000'}10 0%, ${'#000000'}30 50%, ${'#000000'}10 100%)`,
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Mock heatmap points */}
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  width: `${Math.random() * 60 + 20}px`,
                  height: `${Math.random() * 60 + 20}px`,
                  background: `radial-gradient(circle, ${'#000000'}${Math.floor(Math.random() * 50 + 20)} 0%, transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(10px)'
                }}
              />
            ))}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              fontSize: '12px',
              color: '#666666',
              background: '#ffffff',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${'#e0e0e0'}`
            }}>
              Click density visualization for {selectedPage}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '300',
          letterSpacing: '0.1em',
          color: '#000000',
          marginBottom: '16px'
        }}>
          LIVE ACTIVITY
        </h3>
        <div style={{
          padding: '16px',
          background: '#d1d5db',
          border: `1px solid ${'#e0e0e0'}`,
          borderRadius: '8px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {visitors.filter(v => v.isActive).slice(0, 10).map((visitor) => (
            <div key={visitor.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: `1px solid ${'#e0e0e0'}40`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
                <div>
                  <div style={{ fontSize: '13px', color: '#000000' }}>
                    {visitor.country}, {visitor.city}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666666' }}>
                    {visitor.device} • {visitor.browser} • {visitor.currentPage}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#666666' }}>
                {Math.floor(visitor.duration / 60)}:{String(visitor.duration % 60).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default AnalyticsDashboard
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDashboardData } from '../hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import geojsonDataRaw from '../data/indonesia-provinces.json';
import { Filter, Layers as LayersIcon, Info, TrendingUp, Maximize2 } from 'lucide-react';
import { cn } from '../lib/utils';

const PROVINCE_NAME_MAP: Record<string, string> = {
  'Aceh': 'ACEH',
  'Bali': 'BALI',
  'Banten': 'BANTEN',
  'Bengkulu': 'BENGKULU',
  'Daerah Istimewa Yogyakarta': 'DI YOGYAKARTA',
  'DKI Jakarta': 'DKI JAKARTA',
  'Gorontalo': 'GORONTALO',
  'Jambi': 'JAMBI',
  'Jawa Barat': 'JAWA BARAT',
  'Jawa Tengah': 'JAWA TENGAH',
  'Jawa Timur': 'JAWA TIMUR',
  'Kalimantan Barat': 'KALIMANTAN BARAT',
  'Kalimantan Selatan': 'KALIMANTAN SELATAN',
  'Kalimantan Tengah': 'KALIMANTAN TENGAH',
  'Kalimantan Timur': 'KALIMANTAN TIMUR',
  'Kalimantan Utara': 'KALIMANTAN UTARA',
  'Kepulauan Bangka Belitung': 'BANGKA BELITUNG',
  'Kepulauan Riau': 'KEPULAUAN RIAU',
  'Lampung': 'LAMPUNG',
  'Maluku': 'MALUKU',
  'Maluku Utara': 'MALUKU UTARA',
  'Nusa Tenggara Barat': 'NUSA TENGGARA BARAT',
  'Nusa Tenggara Timur': 'NUSA TENGGARA TIMUR',
  'Papua': 'PAPUA',
  'Papua Barat': 'PAPUA BARAT',
  'Riau': 'RIAU',
  'Sulawesi Barat': 'SULAWESI BARAT',
  'Sulawesi Selatan': 'SULAWESI SELATAN',
  'Sulawesi Tengah': 'SULAWESI TENGAH',
  'Sulawesi Tenggara': 'SULAWESI TENGGARA',
  'Sulawesi Utara': 'SULAWESI UTARA',
  'Sumatera Barat': 'SUMATERA BARAT',
  'Sumatera Selatan': 'SUMATERA SELATAN',
  'Sumatera Utara': 'SUMATERA UTARA',
};

type MetricKey = 'mortalitas_pneumonia' | 'kemiskinan_pct' | 'rasio_dokter_per_100k' | 'cluster';

export const InteractiveMaps: React.FC = () => {
  const { data, loading } = useDashboardData();
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('cluster');
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    setGeoData(geojsonDataRaw);
  }, []);

  if (loading || !data || !geoData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
      </div>
    );
  }

  const getProvinceValue = (provName: string, metric: MetricKey) => {
    const normalizedName = PROVINCE_NAME_MAP[provName] || provName.toUpperCase();
    
    if (metric === 'cluster') {
      const clusterEntries = Object.entries(data.clustering.kmeans.cluster_profiles);
      for (const [id, profile] of clusterEntries) {
        if (profile.provinces.includes(normalizedName)) {
          return parseInt(id.replace('Cluster ', ''));
        }
      }
      return 0;
    }

    if (metric === 'mortalitas_pneumonia') {
       const clusterEntries = Object.entries(data.clustering.kmeans.cluster_profiles);
       for (const [_, profile] of clusterEntries) {
         if (profile.provinces.includes(normalizedName)) {
           return profile.mortalitas_pneumonia;
         }
       }
    }
    
    if (metric === 'kemiskinan_pct') {
      const clusterEntries = Object.entries(data.clustering.kmeans.cluster_profiles);
      for (const [_, profile] of clusterEntries) {
        if (profile.provinces.includes(normalizedName)) {
          return profile.kemiskinan_pct;
        }
      }
    }

    if (metric === 'rasio_dokter_per_100k') {
      const clusterEntries = Object.entries(data.clustering.kmeans.cluster_profiles);
      for (const [_, profile] of clusterEntries) {
        if (profile.provinces.includes(normalizedName)) {
          return profile.rasio_dokter_per_100k;
        }
      }
    }

    return 0;
  };

  const getColor = (value: number, metric: MetricKey) => {
    if (metric === 'cluster') {
      const colors = ['#94a3b8', '#6366f1', '#10b981', '#ef4444', '#f59e0b'];
      return colors[value] || colors[0];
    }
    
    if (metric === 'mortalitas_pneumonia') {
      return value > 0.7 ? '#991b1b' :
             value > 0.5 ? '#dc2626' :
             value > 0.3 ? '#ef4444' :
             value > 0.2 ? '#f87171' :
                           '#fee2e2';
    }

    if (metric === 'kemiskinan_pct') {
      return value > 15 ? '#1e3a8a' :
             value > 12 ? '#1d4ed8' :
             value > 9  ? '#3b82f6' :
             value > 6  ? '#93c5fd' :
                          '#dbeafe';
    }

    if (metric === 'rasio_dokter_per_100k') {
      return value > 80 ? '#065f46' :
             value > 50 ? '#059669' :
             value > 30 ? '#10b981' :
             value > 20 ? '#6ee7b7' :
                          '#ecfdf5';
    }

    return '#f1f5f9';
  };

  const style = (feature: any) => {
    const val = getProvinceValue(feature.properties.PROVINSI, selectedMetric);
    return {
      fillColor: getColor(val, selectedMetric),
      weight: 1,
      opacity: 1,
      color: 'rgba(255,255,255,0.2)',
      fillOpacity: 0.8
    };
  };

  const metrics: { key: MetricKey; label: string; icon: any }[] = [
    { key: 'cluster', label: 'Cluster Groups', icon: LayersIcon },
    { key: 'mortalitas_pneumonia', label: 'Mortality Index', icon: TrendingUp },
    { key: 'kemiskinan_pct', label: 'Poverty Rate', icon: Filter },
    { key: 'rasio_dokter_per_100k', label: 'Healthcare Density', icon: Info },
  ];

  const onEachProvince = (feature: any, layer: any) => {
    const prov = feature.properties.PROVINSI;
    const val = getProvinceValue(prov, selectedMetric);
    const normalized = PROVINCE_NAME_MAP[prov] || prov.toUpperCase();
    
    layer.bindTooltip(`
      <div style="padding: 6px; font-family: sans-serif; text-align: left;">
        <div style="font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #eee; margin-bottom: 4px; padding-bottom: 2px; font-size: 10px; color: #111;">${normalized}</div>
        <div style="font-size: 11px; font-weight: 700; color: #444;">
          ${selectedMetric === 'cluster' ? `Archetype: Cluster ${val}` : `${metrics.find(m => m.key === selectedMetric)?.label}: ${val.toFixed(3)}`}
        </div>
      </div>
    `, { sticky: true });

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: 'white',
          fillOpacity: 1
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: 'rgba(255,255,255,0.2)',
          fillOpacity: 0.8
        });
      }
    });
  };

  return (
    <div className="space-y-10 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">Geospatial Intelligence</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Regional Risk Topology & Demographic Overlays</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={cn(
                "flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200",
                selectedMetric === m.key
                  ? "bg-white dark:bg-slate-900 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              )}
            >
              <m.icon className="mr-2 h-3 w-3" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="h-[700px] relative border-none ring-1 ring-slate-200 dark:ring-slate-800 shadow-none overflow-hidden">
            <div className="absolute right-6 top-6 z-[1000]">
              <div className="rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 shadow-xl border border-slate-200 dark:border-slate-800">
                 <Maximize2 className="h-4 w-4 text-slate-500 cursor-pointer hover:text-primary transition-colors" />
              </div>
            </div>
            
            <MapContainer 
              center={[-2.5, 118]} 
              zoom={5} 
              className="h-full w-full"
              scrollWheelZoom={false}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <GeoJSON 
                key={selectedMetric}
                data={geoData} 
                style={style}
                onEachFeature={onEachProvince}
              />
            </MapContainer>
            
            {/* Legend Card */}
            <div className="absolute bottom-8 right-8 z-[1000]">
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-2xl p-6 min-w-[240px]">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">Topology Legend</h4>
                <div className="space-y-4">
                  {selectedMetric === 'cluster' ? (
                    <div className="space-y-3">
                      {Object.entries(data.clustering.kmeans.cluster_profiles).map(([id, profile], idx) => (
                        <div key={id} className="flex items-center text-[10px] font-bold">
                          <span className="w-2.5 h-2.5 rounded-full mr-3 ring-2 ring-slate-100 dark:ring-slate-800" style={{ backgroundColor: getColor(idx + 1, 'cluster') }} />
                          <span className="text-slate-600 dark:text-slate-300 uppercase tracking-tight">{profile.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                       <div className="flex items-center text-[9px] font-black text-slate-400 justify-between uppercase tracking-tighter">
                         <span>Low Magnitude</span>
                         <span>Critical Alert</span>
                       </div>
                       <div className="h-1.5 w-full rounded-full overflow-hidden flex ring-1 ring-slate-100 dark:ring-slate-800">
                         {Array.from({length: 10}).map((_, i) => (
                           <div key={i} className="flex-1 h-full" style={{ backgroundColor: getColor(i/10, selectedMetric) }} />
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Card>
        </div>

        <div className="space-y-6 text-left">
          <Card className="border-none ring-1 ring-primary/20 bg-primary/5 shadow-none">
            <CardHeader className="pb-2 border-none">
              <div className="flex items-center space-x-2">
                 <Info className="h-4 w-4 text-primary" />
                 <CardTitle className="text-[10px] text-primary">Strategic Insight</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                {selectedMetric === 'cluster' && "Spatial clustering reveals a stark divide in healthcare outcomes between the Western hubs and Eastern frontiers."}
                {selectedMetric === 'mortalitas_pneumonia' && "High-intensity pneumonia mortality zones are heavily concentrated in NTT, Papua, and Gorontalo provinces."}
                {selectedMetric === 'kemiskinan_pct' && "Poverty metrics show a 82% spatial correlation with high mortality clusters in our rule-based analysis."}
                {selectedMetric === 'rasio_dokter_per_100k' && "Critical doctor-to-population shortages persist across 60% of the archipelagic territory."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[10px] text-slate-400">Critical Priority Ranking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0.5">
              {data.mortality_composite_ranking.top_5_provinces.map((p, idx) => (
                <div key={p.provinsi} className="flex items-center justify-between py-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-black text-slate-300">0{idx+1}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{p.provinsi}</span>
                  </div>
                  <span className="font-mono text-xs font-black text-primary">{p.mortality_composite.toFixed(3)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { StarData } from '@/lib/supabase';

// Register fonts
Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFkD-vYSZviVYUb_rj3ij__anPXDTy1a653P87P5dJm02v3.woff2'
});

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#050508',
    color: '#ffffff',
    padding: 60,
    fontFamily: 'Inter'
  },
  header: {
    marginBottom: 40,
    textAlign: 'center'
  },
  title: {
    fontSize: 36,
    fontFamily: 'Playfair Display',
    color: '#ffd700',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginBottom: 10,
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  },
  subtitle: {
    fontSize: 14,
    color: '#cccccc',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  content: {
    marginBottom: 40
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 20
  },
  label: {
    fontSize: 10,
    color: '#888888',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  value: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold'
  },
  coordinates: {
    fontSize: 16,
    color: '#ffd700',
    fontWeight: 'bold'
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 12,
    color: '#888888',
    lineHeight: 1.6
  },
  seal: {
    position: 'absolute',
    right: 60,
    top: 60,
    width: 80,
    height: 80,
    opacity: 0.1
  },
  holographicEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 40%, rgba(255,215,0,0.1) 50%, transparent 60%)',
    pointerEvents: 'none'
  }
});

interface CertificatePDFProps {
  starData: StarData;
  treeCount: number;
  date: string;
}

const CertificatePDF: React.FC<CertificatePDFProps> = ({ starData, treeCount, date }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Holographic effect overlay */}
        <View style={styles.holographicEffect} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Certificate of Stellar Recovery</Text>
          <Text style={styles.subtitle}>Cosmic Cartography Registry</Text>
        </View>

        {/* Star Information */}
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>Star Name</Text>
            <Text style={styles.value}>{starData.name || 'Unnamed Star'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Celestial Coordinates</Text>
            <Text style={styles.coordinates}>
              Right Ascension: {starData.ra}
            </Text>
            <Text style={styles.coordinates}>
              Declination: {starData.dec}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Stellar Classification</Text>
            <Text style={styles.value}>
              Spectral Class: {starData.spectralClass}
            </Text>
            <Text style={styles.value}>
              Apparent Magnitude: {starData.magnitude.toFixed(2)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Registry Information</Text>
            <Text style={styles.value}>Registry ID: {starData.id}</Text>
            <Text style={styles.value}>Discovery Date: {date}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This celestial body has been officially registered in the Cosmic Cartography Registry.
          </Text>
          <Text style={{ marginTop: 8, color: '#ffd700', fontWeight: 'bold' }}>
            Part of a constellation that has planted {treeCount} trees on Earth.
          </Text>
          <Text style={{ marginTop: 8 }}>
            Registry Date: {date}
          </Text>
        </View>

        {/* Decorative seal */}
        <Image 
          style={styles.seal}
          src="/cosmos-seal.png" // You'll need to create this image
        />
      </Page>
    </Document>
  );
};

export default CertificatePDF;
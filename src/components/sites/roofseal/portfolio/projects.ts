// Project membership and locations: approved Projects List spreadsheet, 28 October 2026.
export type PortfolioProject = { title: string; location: string; image: string; sourceUrl: string };
export type PortfolioDivision = { slug: string; title: string; projects: PortfolioProject[] };
export const portfolioDivisions: PortfolioDivision[] = [
  {
    "slug": "metal-roof",
    "title": "Metal Roof",
    "projects": [
      {
        "title": "130 Units Semi-D House, Clover Garden Residence",
        "location": "Cyberjaya, Selangor",
        "image": "/sites/roofseal/projects/130-Units-Semi-D-House-Clover-Garden-Residence-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/130-Units-Semi-D-House-Clover-Garden-Residence-1.jpg"
      },
      {
        "title": "Tesco Store",
        "location": "Ara Damansara",
        "image": "/sites/roofseal/projects/Tesco-Store-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/Tesco-Store-1.jpg"
      },
      {
        "title": "Factory at Kawasan Perindustrian Mahkota",
        "location": "Beranang, Selangor",
        "image": "/sites/roofseal/projects/Factory-at-Kawasan-Perindustrian-Mahkota-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/Factory-at-Kawasan-Perindustrian-Mahkota-1.jpg"
      },
      {
        "title": "UPSI Hostel",
        "location": "Tg Malim, Perak",
        "image": "/sites/roofseal/projects/UPSI-Hostel-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/UPSI-Hostel-1.jpg"
      },
      {
        "title": "208 Units Semi-D House, Phase 5",
        "location": "Selayang, Selangor",
        "image": "/sites/roofseal/projects/208-Units-Semi-D-House-Phase-5-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/208-Units-Semi-D-House-Phase-5-1.jpg"
      },
      {
        "title": "160 Units Double Storey House, Taman Scientex",
        "location": "Skudai, Johor",
        "image": "/sites/roofseal/projects/160-Units-Double-Storey-House-Taman-Scientex-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/160-Units-Double-Storey-House-Taman-Scientex-1.jpg"
      },
      {
        "title": "150 Units Double Storey Cluster House",
        "location": "Desa Tebrau, Johor Bahru",
        "image": "/sites/roofseal/projects/150-Units-Double-Storey-Cluster-House-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/150-Units-Double-Storey-Cluster-House-1.jpg"
      },
      {
        "title": "94 Units Shop Office, Seksyen U13",
        "location": "Setia Alam, Selangor",
        "image": "/sites/roofseal/projects/94-Units-Shop-Office-Seksyen-U13-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/94-Units-Shop-Office-Seksyen-U13-1.jpg"
      },
      {
        "title": "80 Units Double Storey House",
        "location": "Shah Alam, Selangor",
        "image": "/sites/roofseal/projects/80-Units-Double-Storey-House-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/80-Units-Double-Storey-House-1.jpg"
      },
      {
        "title": "Century Logistic",
        "location": "PTP, Johor Bahru",
        "image": "/sites/roofseal/projects/Century-Logistic-Project.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/Century-Logistic-Project.jpg"
      },
      {
        "title": "Hitachi Plant",
        "location": "Bangi, Selangor",
        "image": "/sites/roofseal/projects/Hitachi-Plant-Project.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/Hitachi-Plant-Project.jpg"
      },
      {
        "title": "Sales Gallery",
        "location": "Puchong Putra Perdana",
        "image": "/sites/roofseal/projects/project-puchong-1.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/project-puchong-1.jpg"
      }
    ]
  },
  {
    "slug": "metal-doors-frames",
    "title": "Metal Doors & Frame",
    "projects": [
      {
        "title": "Adelia 2 Apartment",
        "location": "Bangi Avenue, Kajang",
        "image": "/sites/roofseal/projects/m_adelia-2-apartment-bangi-avenue.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/m_adelia-2-apartment-bangi-avenue.jpg"
      },
      {
        "title": "Idaman Abadi Condominium",
        "location": "Tropicana Heights Kajang",
        "image": "/sites/roofseal/projects/m_idaman-abadi-tropicana-heights.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/m_idaman-abadi-tropicana-heights.jpg"
      },
      {
        "title": "Pavilion Damansara Heights",
        "location": "Damansara Heights, Kuala Lumpur",
        "image": "/sites/roofseal/projects/m_pavilion-damansara-heights.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/m_pavilion-damansara-heights.jpg"
      },
      {
        "title": "Verando Residence Serviced Apartment",
        "location": "PJ South Sentral, Selangor",
        "image": "/sites/roofseal/projects/m_verando-residence-PJ.jpg",
        "sourceUrl": "https://www.roofseal.com.my/wp-content/uploads/m_verando-residence-PJ.jpg"
      }
    ]
  }
];
export const getPortfolioDivision = (slug: string) => portfolioDivisions.find(division => division.slug === slug);

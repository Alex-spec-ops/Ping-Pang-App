import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

let cachedGeoJSON: any = null;

export async function GET() {
  if (cachedGeoJSON) {
    return NextResponse.json(cachedGeoJSON);
  }

  const filePath = path.join(process.cwd(), 'data', 'pingpong_tables_world.csv');
  
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Data file not found" }, { status: 404 });
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const records = parse(fileContent, {
    skip_empty_lines: true,
    from_line: 2 // Skip header
  });

  const features = records.map((record: any) => {
    const id = record[0];
    const lat = parseFloat(record[2]);
    const lon = parseFloat(record[3]);
    
    // Ignore invalid coordinates
    if (isNaN(lat) || isNaN(lon)) return null;

    const name = record[4] || '';
    const category = record[5] || 'inconnu';
    const count = parseInt(record[6]) || 1;
    const indoor = record[11] || '';
    const access = record[12] || '';

    return {
      type: "Feature",
      properties: { 
        cluster: false, 
        tableId: id, 
        name,
        category, 
        count,
        indoor,
        access
      },
      geometry: { type: "Point", coordinates: [lon, lat] } // GeoJSON is [lon, lat]
    };
  }).filter(Boolean); // Remove nulls

  cachedGeoJSON = features;

  return NextResponse.json(features);
}

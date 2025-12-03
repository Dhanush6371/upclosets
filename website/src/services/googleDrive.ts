// Google Drive API Service
const API_KEY = 'AIzaSyDr-0-WButyM1rAXdA1wxFQGrFYwFVOP2g';
const MAIN_FOLDER_ID = '1gh3-6vYa0avEPsZBRc0UL-5KysL5RhM-';

// Note: Subfolders are now fetched automatically from the main folder!
// No need to manually add folder IDs anymore

export interface DriveCategory {
  id: string;
  name: string;
  folderId: string;
}

export interface DriveImage {
  id: string;
  name: string;
  thumbnailLink: string;
  webViewLink: string;
  webContentLink: string;
  categoryId: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  image: string;
  categoryId: string;
  categoryName: string;
}

/**
 * Fetch all subfolders (categories) from the main folder
 * This automatically discovers all folders inside the main folder - no hardcoding needed!
 */
export async function fetchCategories(): Promise<DriveCategory[]> {
  try {
    console.log(`🔍 Fetching all subfolders from main folder: ${MAIN_FOLDER_ID}`);
    
    // Query for all folders inside the main folder
    const query = `'${MAIN_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const url = `https://www.googleapis.com/drive/v3/files?key=${API_KEY}&q=${encodeURIComponent(query)}&fields=files(id,name)&orderBy=name&pageSize=100`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to fetch subfolders:', response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return [];
    }
    
    const data = await response.json();
    const folders = data.files || [];
    
    console.log(`✅ Found ${folders.length} category folders:`, folders.map((f: any) => f.name));
    
    const categories: DriveCategory[] = folders.map((folder: any) => ({
      id: folder.id,
      name: folder.name,
      folderId: folder.id
    }));
    
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch images from a specific folder
 */
export async function fetchImagesFromFolder(folderId: string): Promise<DriveImage[]> {
  try {
    const query = `'${folderId}' in parents and (mimeType contains 'image/')`;
    // Request additional fields including permissions
    const url = `https://www.googleapis.com/drive/v3/files?key=${API_KEY}&q=${encodeURIComponent(query)}&fields=files(id,name,thumbnailLink,webViewLink,webContentLink,mimeType)&pageSize=100`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to fetch images:', response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return [];
    }
    
    const data = await response.json();
    console.log('📦 Raw API response:', data);
    
    return (data.files || []).map((file: any) => ({
      id: file.id,
      name: file.name,
      thumbnailLink: file.thumbnailLink,
      webViewLink: file.webViewLink,
      webContentLink: file.webContentLink,
      categoryId: folderId
    }));
  } catch (error) {
    console.error('Error fetching images from folder:', error);
    return [];
  }
}

/**
 * Fetch all catalog items (images from all category folders)
 */
export async function fetchAllCatalogItems(): Promise<CatalogItem[]> {
  try {
    console.log('🔍 Fetching categories...');
    const categories = await fetchCategories();
    console.log('✅ Categories fetched:', categories);
    
    const allItems: CatalogItem[] = [];
    
    for (const category of categories) {
      console.log(`📁 Fetching images from folder: ${category.name} (${category.folderId})`);
      const images = await fetchImagesFromFolder(category.folderId);
      console.log(`✅ Found ${images.length} images in ${category.name}`);
      
      for (const image of images) {
        // Use multiple URL formats to try
        const urls = [
          `https://www.googleapis.com/drive/v3/files/${image.id}?alt=media&key=${API_KEY}`, // Direct file download with API key
          `https://drive.google.com/thumbnail?id=${image.id}&sz=w1000`, // Thumbnail (requires public)
          image.thumbnailLink ? image.thumbnailLink.replace('=s220', '=s1000') : null, // API thumbnail
          `https://drive.google.com/uc?export=view&id=${image.id}`, // Direct view
        ].filter(Boolean);
        
        const imageUrl = urls[0] as string; // Try the API media endpoint first
        
        console.log(`🖼️ Image: ${image.name}`);
        console.log(`   🔗 Primary URL: ${imageUrl}`);
        console.log(`   📎 Thumbnail: ${image.thumbnailLink || 'N/A'}`);
        console.log(`   💡 Fallback URLs available: ${urls.length}`);
        
        allItems.push({
          id: image.id,
          title: image.name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, ''),
          image: imageUrl,
          categoryId: category.id,
          categoryName: category.name
        });
      }
    }
    
    console.log(`✅ Total catalog items: ${allItems.length}`);
    return allItems;
  } catch (error) {
    console.error('❌ Error fetching catalog items:', error);
    return [];
  }
}

/**
 * Convert Google Drive file ID to direct image URL
 * Using multiple fallback methods for better compatibility
 */
export function getDirectImageUrl(fileId: string): string {
  // This format works best for publicly shared images
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Get high-quality image URL (alternative format)
 */
export function getHighQualityImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/**
 * Get thumbnail URL
 */
export function getThumbnailUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
}


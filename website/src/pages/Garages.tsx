import CustomSpaceTemplate from '../components/CustomSpaceTemplate';

export default function Garages() {
  return (
    <CustomSpaceTemplate
      title="Garages"
      heroImage="https://images.pexels.com/photos/7034682/pexels-photo-7034682.jpeg?auto=compress&cs=tinysrgb&w=1600"
      description="Heavy-duty shelving, wall systems, and cabinets for tools and equipment. Transform your garage into an organized workshop and storage space."
      features={[
        'Heavy-duty wall-mounted systems',
        'Overhead storage racks',
        'Tool organization panels',
        'Workbench integration',
        'Sports equipment storage',
        'Durable powder-coated finishes',
      ]}
      galleryImages={[
        'https://images.pexels.com/photos/7034682/pexels-photo-7034682.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1467564/pexels-photo-1467564.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg?auto=compress&cs=tinysrgb&w=800',
      ]}
    />
  );
}

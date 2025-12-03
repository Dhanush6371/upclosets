import CustomSpaceTemplate from '../components/CustomSpaceTemplate';

export default function OfficeRoom() {
  return (
    <CustomSpaceTemplate
      title="Office Room"
      heroImage="https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1600"
      description="Modern storage and desk systems for productive home offices. Create an organized workspace that inspires creativity and efficiency."
      features={[
        'Custom built-in desk and workspace design',
        'Floating shelves and wall-mounted storage',
        'File cabinet and document organization systems',
        'Cable management solutions',
        'Adjustable shelving for books and supplies',
        'Ergonomic design considerations',
      ]}
      galleryImages={[
        'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/7005091/pexels-photo-7005091.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6585596/pexels-photo-6585596.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3846508/pexels-photo-3846508.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6315797/pexels-photo-6315797.jpeg?auto=compress&cs=tinysrgb&w=800',
      ]}
    />
  );
}

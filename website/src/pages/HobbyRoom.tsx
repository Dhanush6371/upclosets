import CustomSpaceTemplate from '../components/CustomSpaceTemplate';

export default function HobbyRoom() {
  return (
    <CustomSpaceTemplate
      title="Hobby Room"
      heroImage="https://images.pexels.com/photos/6957906/pexels-photo-6957906.jpeg?auto=compress&cs=tinysrgb&w=1600"
      description="Custom storage for craft, music, or art rooms. Organize your passion with dedicated spaces for supplies, equipment, and creative tools."
      features={[
        'Customizable storage bins and cubbies',
        'Wall-mounted pegboard systems',
        'Dedicated equipment and instrument storage',
        'Craft table and workspace integration',
        'Supply organization and labeling systems',
        'Climate-controlled cabinet options',
      ]}
      galleryImages={[
        'https://images.pexels.com/photos/6957906/pexels-photo-6957906.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6928051/pexels-photo-6928051.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6492398/pexels-photo-6492398.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/8088493/pexels-photo-8088493.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6942037/pexels-photo-6942037.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=800',
      ]}
    />
  );
}

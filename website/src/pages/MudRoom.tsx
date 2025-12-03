import CustomSpaceTemplate from '../components/CustomSpaceTemplate';

export default function MudRoom() {
  return (
    <CustomSpaceTemplate
      title="Mud Room"
      heroImage="https://images.pexels.com/photos/6283961/pexels-photo-6283961.jpeg?auto=compress&cs=tinysrgb&w=1600"
      description="Bench seating, coat racks, and cubby storage systems. Create a welcoming entry space that keeps your home organized and clutter-free."
      features={[
        'Built-in bench seating with storage',
        'Individual cubbies for family members',
        'Coat hooks and hanging systems',
        'Shoe storage and organization',
        'Durable, easy-to-clean materials',
        'Basket and bin integration',
      ]}
      galleryImages={[
        'https://images.pexels.com/photos/6283961/pexels-photo-6283961.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6480706/pexels-photo-6480706.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/7031610/pexels-photo-7031610.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6444390/pexels-photo-6444390.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/6527061/pexels-photo-6527061.jpeg?auto=compress&cs=tinysrgb&w=800',
      ]}
    />
  );
}

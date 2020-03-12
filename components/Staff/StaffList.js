import { Card } from 'semantic-ui-react';

// import this into Admin Panel. like ProductList in index page
function StaffList({ staff }) {
  // mapping employee properties to items attribute
  function mapStaffToItems(staff) {
    return staff.map((employee) => {
      return {
        header: `${employee.firstname} ${employee.lastname}`,
        image: employee.mediaUrl,
        color: 'grey',
        meta: `Salary $${employee.salary}`,
        fluid: true,
        childKey: employee._id,
        href: `/staff?_id=${employee._id}`
      };
    });
  }
  // Card Group (staff) with items set to employee properties
  return (
    <Card.Group
      stackable
      centered
      itemsPerRow="3"
      items={mapStaffToItems(staff)}
    />
  );
}

export default StaffList;

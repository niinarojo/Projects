using Yellowbrick.Models.Domain.Lookups;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Yellowbrick.Models.Domain.Appointments
{
	public class Appointment
	{
		public int Id { get; set; }
		public LookUp AppointmentType { get; set; }
		public string Name { get; set; }
		public Client Client { get; set; }
		public string Notes { get; set; }
		public Location Location { get; set; }
		public bool IsConfirmed { get; set; }
		public DateTime AppointmentStart { get; set; }
		public DateTime AppointmentEnd { get; set; }
		public DateTime DateCreated { get; set; }
		public DateTime DateModified { get; set; }
		public BaseUser CreatedBy { get; set; }
   		public int ModifiedBy { get; set; }

    }
}

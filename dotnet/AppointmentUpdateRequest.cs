using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Yellowbrick.Models.Requests.Appointments
{
    public class AppointmentUpdateRequest : AppointmentAddRequest, IModelIdentifier
    {
      
        public int Id { get; set; }
        public bool IsConfirmed { get; set; }
        public int LocationId { get; set; }
    }
}

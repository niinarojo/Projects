using Yellowbrick.Models.Domain;
using Yellowbrick.Models.Requests.Locations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Yellowbrick.Models.Requests.Appointments
{
    public class AppointmentAddRequest
    {
        [Required(ErrorMessage = "Appointment Type is required.")]
        [Range(1, int.MaxValue)]
        public int AppointmentTypeId { get; set; }

        [Required(ErrorMessage = "Client Id is required.")]
        [Range(1, int.MaxValue)]
        public int ClientId { get; set; }

        #nullable enable
        public string? Notes { get; set; }
 
        public LocationAddRequest? Location { get; set; }
        #nullable disable

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime AppointmentStart { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime AppointmentEnd { get; set; }



    }
}

using Yellowbrick.Models.Domain.Appointments;
using Yellowbrick.Models;
using Yellowbrick.Models.Requests.Appointments;
using Microsoft.AspNetCore.Mvc;
using Yellowbrick.Models.Requests.Locations;

namespace Yellowbrick.Services.Interfaces
{
    public interface IAppointmentService
    {
        int Add(AppointmentAddRequest model, int userId);
        Appointment GetByAppointmentId(int id);
        Paged<Appointment> SearchPaginatedByClientId(int pageIndex, int pageSize, int clientId);
        Paged<Appointment> GetByUserId(int pageIndex, int pageSize, int userId);
        void Update(AppointmentUpdateRequest model, int userId);
        void SoftDelete(int id, int userId);
    }
}

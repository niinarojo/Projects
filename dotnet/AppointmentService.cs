using Yellowbrick.Data.Providers;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Yellowbrick.Models.Requests.Appointments;
using Yellowbrick.Models.Domain;
using Yellowbrick.Models.Domain.Appointments;
using Yellowbrick.Models;
using Yellowbrick.Data;
using Yellowbrick.Models.Domain.Lookups;
using Yellowbrick.Services.Interfaces;
using Yellowbrick.Models.Requests.Locations;
using System.Reflection;

namespace Yellowbrick.Services
{
    public class AppointmentService : IAppointmentService
    {
        IDataProvider _data = null;
        private readonly ILookUpService _lookUp = null;
        private readonly IMapBaseUser _mapUser = null;
        private readonly ILocationMapper _locationMapper = null;

        public AppointmentService(IDataProvider data, 
            ILookUpService lookUp, 
            IMapBaseUser mapUser,
            ILocationMapper locationMapper)
        {
            _data = data;
            _lookUp = lookUp;
            _mapUser = mapUser;
            _locationMapper = locationMapper;
        }

         
    public int Add(AppointmentAddRequest model, int userId)
    {
            int id = 0;
            string procName = "[dbo].[Appointments_Insert]";
            if (model.Location != null)
            {

                procName = "[dbo].[Appointments_InsertV2]";
            }

            _data.ExecuteNonQuery(procName,
               inputParamMapper: delegate (SqlParameterCollection col)
               {
                 
                   AddCommonParams(model, userId, col);

                   if(model.Location != null)
                   {
                       AddCommonLocationParams(model.Location, col);
                   }


                   SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                   idOut.Direction = ParameterDirection.Output;
                   col.Add(idOut);

               }, returnParameters: delegate (SqlParameterCollection returnCollection)
               {

                   object oId = returnCollection["@Id"].Value;
                   int.TryParse(oId.ToString(), out id);


               });

            return id;
    }

        public Appointment GetByAppointmentId(int id)
        {
            string procName = "[dbo].[Appointments_SelectByIdV2]";

            Appointment appointment = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex;
                MapSingleAppointment(reader, out appointment, out startingIndex);
            });
            return appointment;
        }

        public Paged<Appointment> SearchPaginatedByClientId(int pageIndex, int pageSize, int clientId)
        {
            Paged<Appointment> pagedList = null;
            List<Appointment> list = null;
            Appointment appointment = null;
            int totalCount = 0;

            string procName = "[dbo].[Appointments_SelectByClientIdV2]";

            _data.ExecuteCmd(storedProc: procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@ClientId", clientId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                
                int startingIndex;
                MapSingleAppointment(reader, out appointment, out startingIndex);

                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Appointment>();
                }
                list.Add(appointment);
            });
            if (list != null)
            {
                pagedList = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Appointment> GetByUserId(int pageIndex, int pageSize, int userId)
        {
            Paged<Appointment> pagedList = null;
            List<Appointment> list = null;
            Appointment appointment = null;
            int totalCount = 0;

            string procName = "[dbo].[Appointments_SelectByUserId]";

            _data.ExecuteCmd(storedProc: procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@UserId", userId);



            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {

                int startingIndex;
                MapSingleAppointment(reader, out appointment, out startingIndex);

                totalCount = reader.GetSafeInt32(startingIndex);

                if (list == null)
                {
                    list = new List<Appointment>();
                }
                list.Add(appointment);
            });
            if (list != null)
            {
                pagedList = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public void Update(AppointmentUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Appointments_Update]";
            if (model.Location != null && model.LocationId == 0)  
            {
                procName = "[dbo].[Appointments_UpdateV4]";
                
            } else if (model.Location != null)
            {
                procName = "[dbo].[Appointments_UpdateV3]";
            }

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, userId, col);
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@IsConfirmed", model.IsConfirmed);
                    col.AddWithValue("@LocationId", model.LocationId);
                    if (model.Location != null)
                    {
                        AddCommonLocationParams(model.Location, col);
                    }
                }, returnParameters: null);
        }

        public void SoftDelete(int id, int userId)
        {
            string procName = "[dbo].[Appointments_Delete]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                    col.AddWithValue("@UserId", userId);
                }, null);
        }

        private void MapSingleAppointment(IDataReader reader, out Appointment appointment, out int startingIndex)
        {
            appointment = new Appointment();
            appointment.Client = new Client();
            appointment.Location = new Location();
           
            startingIndex = 0;

            appointment.Id = reader.GetSafeInt32(startingIndex++);
            appointment.AppointmentType = _lookUp.MapSingleLookUp(reader, ref startingIndex);
            appointment.Client.Id = reader.GetSafeInt32(startingIndex++);
            appointment.Client.FirstName = reader.GetSafeString(startingIndex++);
            appointment.Client.LastName = reader.GetSafeString(startingIndex++);
            appointment.Client.Phone = reader.GetSafeString(startingIndex++);
            appointment.Client.Email = reader.GetSafeString(startingIndex++);
            appointment.Notes = reader.GetSafeString(startingIndex++);
            appointment.Location = _locationMapper.MapSingleLocation(reader, ref startingIndex);
            appointment.IsConfirmed = reader.GetSafeBool(startingIndex++);
            appointment.AppointmentStart = reader.GetSafeDateTime(startingIndex++);
            appointment.AppointmentEnd = reader.GetSafeDateTime(startingIndex++);
            appointment.DateCreated = reader.GetSafeDateTime(startingIndex++);
            appointment.DateModified = reader.GetSafeDateTime(startingIndex++);
            appointment.CreatedBy = _mapUser.MapBaseUser(reader, ref startingIndex);
            appointment.ModifiedBy = reader.GetSafeInt32(startingIndex++);
        }

        private static void AddCommonLocationParams(LocationAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@LocationTypeId", model.LocationTypeId);
            col.AddWithValue("@LineOne", model.LineOne);
            col.AddWithValue("@LineTwo", model.LineTwo);
            col.AddWithValue("@City", model.City);
            col.AddWithValue("@Zip", model.Zip);
            col.AddWithValue("@StateId", model.StateId);
            col.AddWithValue("@Latitude", model.Latitude);
            col.AddWithValue("@Longitude", model.Longitude);
        }
        private static void AddCommonParams(AppointmentAddRequest model, int userId, SqlParameterCollection col)
        {
            col.AddWithValue("@AppointmentTypeId", model.AppointmentTypeId);
            col.AddWithValue("@ClientId", model.ClientId);
            col.AddWithValue("@Notes", model.Notes);
            col.AddWithValue("@AppointmentStart", model.AppointmentStart);
            col.AddWithValue("@AppointmentEnd", model.AppointmentEnd);
            col.AddWithValue("@UserId", userId);
        }

    }
}

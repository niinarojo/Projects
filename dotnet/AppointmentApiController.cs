using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Yellowbrick.Models;
using Yellowbrick.Models.Domain.Appointments;
using Yellowbrick.Models.Requests.Appointments;
using Yellowbrick.Models.Requests.Locations;
using Yellowbrick.Services;
using Yellowbrick.Services.Interfaces;
using Yellowbrick.Web.Controllers;
using Yellowbrick.Web.Models.Responses;
using System;

namespace Yellowbrick.Web.Api.Controllers
{
    [Route(*****)]
    [ApiController]
    public class AppointmentApiController : BaseApiController
    {
        private IAppointmentService _service = null;
        private IAuthenticationService<int> _authService = null;
        public AppointmentApiController(IAppointmentService service,
            ILogger<AppointmentApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(AppointmentAddRequest model)
        {

            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();


                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };


                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpGet(****)]
        public ActionResult<ItemResponse<Appointment>> GetByAppointmentId(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Appointment appointment = _service.GetByAppointmentId(id);

                if (appointment == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Appointment> { Item = appointment };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);
        }

        [HttpGet(*****)]
        public ActionResult<ItemResponse<Paged<Appointment>>> SearchPaginatedByClientId(int pageIndex, int pageSize, int clientId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Appointment> page = _service.SearchPaginatedByClientId(pageIndex, pageSize, clientId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);
        }

        [HttpGet(*****)]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetByUserId(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Appointment> page = _service.GetByUserId(pageIndex, pageSize, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);
        }

        [HttpPut(*****)]
        public ActionResult<SuccessResponse> Update(AppointmentUpdateRequest model)
        {
            
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut(****)]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.SoftDelete(id, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }




    }
}

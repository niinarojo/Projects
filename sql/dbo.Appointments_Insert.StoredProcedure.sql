USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Insert]    Script Date: 9/22/2023 11:16:06 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Niina Rojo
-- Create date:		07/28/2023
-- Description:		Insert proc for dbo.Appointments
-- Code Reviewer:	Joseph Rodriguez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- =============================================

ALTER PROC [dbo].[Appointments_Insert]
	   @AppointmentTypeId int
	  ,@ClientId int
          ,@Notes nvarchar(2000) = NULL
          ,@LocationId int = NULL
          ,@AppointmentStart datetime2(7)
          ,@AppointmentEnd datetime2(7)
          ,@UserId int
		      ,@Id int OUTPUT
           
AS

/*

Declare		@Id int = 0

Declare		@AppointmentTypeId int = 2
		,@ClientId int = 288
	        ,@Notes nvarchar(2000) = 'NOTES'
	        ,@LocationId int = null
	        ,@AppointmentStart datetime2(7) = '2023-08-21 11:30:20'
	        ,@AppointmentEnd datetime2(7) = '2023-08-21 12:30:00'
	        ,@UserId int = 130

Execute [dbo].[Appointments_Insert]
		@AppointmentTypeId
		,@ClientId
	        ,@Notes
	        ,@LocationId
	        ,@AppointmentStart
	        ,@AppointmentEnd
	        ,@UserId
		,@Id OUTPUT

*/


BEGIN

INSERT INTO [dbo].[Appointments]
           ([AppointmentTypeId]
           ,[ClientId]
           ,[Notes]
           ,[LocationId]
           ,[AppointmentStart]
           ,[AppointmentEnd]
           ,[CreatedBy]
           ,[ModifiedBy])
     VALUES
           (@AppointmentTypeId
	    ,@ClientId
            ,@Notes
            ,@LocationId
            ,@AppointmentStart
            ,@AppointmentEnd
            ,@UserId
	    ,@UserId)
	SET @Id = SCOPE_IDENTITY()

END



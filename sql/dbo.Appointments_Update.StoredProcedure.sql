USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_Update]    Script Date: 9/22/2023 11:27:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Niina Rojo
-- Create date:		07/29/2023
-- Description:		Update proc for dbo.Appointments
-- Code Reviewer:	Oscar

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- =============================================
ALTER PROC [dbo].[Appointments_Update]
           @AppointmentTypeId int
           ,@ClientId int
           ,@Notes nvarchar(2000) = null
           ,@LocationId int = null
	   ,@IsConfirmed bit
           ,@AppointmentStart datetime2(7)
           ,@AppointmentEnd datetime2(7)
           ,@UserId int
	   ,@Id int

as

/*

Declare		@Id int = 2

Declare    @AppointmentTypeId int = 1
	   ,@ClientId int = 1
           ,@Notes nvarchar(2000) = 'Test notes'
           ,@LocationId int = 2
	   ,@IsConfirmed bit = 1
           ,@AppointmentStart datetime2(7) = '2024-06-23 08:30:20'
           ,@AppointmentEnd datetime2(7) = '2024-06-23 09:30:20'
           ,@UserId int = 4

		  
Execute [dbo].[Appointments_Update]
	   @AppointmentTypeId
	   ,@ClientId
           ,@Notes
           ,@LocationId
	   ,@IsConfirmed
           ,@AppointmentStart
           ,@AppointmentEnd
           ,@UserId 
	   ,@Id

*/


BEGIN

UPDATE [dbo].[Appointments]
   SET [AppointmentTypeId] = @AppointmentTypeId
      ,[ClientId] = @ClientId
      ,[Notes] = @Notes
      ,[LocationId] = @LocationId
      ,[IsConfirmed] = @IsConfirmed
      ,[AppointmentStart] = @AppointmentStart
      ,[AppointmentEnd] = @AppointmentEnd
      ,[DateModified] = GETUTCDATE()
      ,[ModifiedBy] = @UserId
 WHERE Id = @Id


 END



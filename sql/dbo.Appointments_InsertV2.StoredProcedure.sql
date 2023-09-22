USE [YellowBrick]
GO
/****** Object:  StoredProcedure [dbo].[Appointments_InsertV2]    Script Date: 9/22/2023 11:18:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Niina Rojo
-- Create date:		08/16/2023
-- Description:		Insert proc to insert into dbo.Appointments and dbo.locations
-- Code Reviewer:	Erik

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:

-- =============================================

ALTER PROC [dbo].[Appointments_InsertV2]
	    @AppointmentTypeId int
	   ,@ClientId int
           ,@Notes nvarchar(2000) = NULL
           ,@AppointmentStart datetime2(7)
           ,@AppointmentEnd datetime2(7)
           ,@UserId int		   
	   ,@LocationTypeId int  
           ,@LineOne nvarchar(255)
           ,@LineTwo nvarchar(255)=NULL
           ,@City nvarchar(255)
           ,@Zip nvarchar(50)
           ,@StateId int
           ,@Latitude float
	   ,@Longitude float
	   ,@Id int OUTPUT

           
AS

/*

Declare		@Id int = 0


Declare		@AppointmentTypeId int = 1
		,@ClientId int = 285
	        ,@Notes nvarchar(2000) = 'New notes again'
	        ,@AppointmentStart datetime2(7) = '2023-08-21 12:30:20'
	        ,@AppointmentEnd datetime2(7) = '2023-08-21 13:30:00'
	        ,@UserId int = 130
		,@LocationTypeId int = 1
	        ,@LineOne nvarchar(255) = 'Test address'
	        ,@LineTwo nvarchar(255) = 'TEST2'
	        ,@City nvarchar(255) = 'TEST2'
	        ,@Zip nvarchar(50) = '1245'
	        ,@StateId int = 1
	        ,@Latitude float = 11
		,@Longitude float = 11

Execute [dbo].[Appointments_InsertV2]
		 @AppointmentTypeId
		,@ClientId
	        ,@Notes
	        ,@AppointmentStart
	        ,@AppointmentEnd
	        ,@UserId
    		,@LocationTypeId
    		,@LineOne
		 ,@LineTwo
		 ,@City
		 ,@Zip
		 ,@StateId
		 ,@Latitude 
		 ,@Longitude
		 ,@Id OUTPUT


*/


BEGIN TRY
 
	BEGIN TRANSACTION
		Declare @LocationsTableId int = 0
 
		EXECUTE dbo.Locations_Insert
			 @LocationTypeId
			,@LineOne
			,@LineTwo
			,@City
			,@Zip
			,@StateId
			,@Latitude 
			,@Longitude
			,@UserId
			,@LocationsTableId OUTPUT

		

	EXECUTE dbo.Appointments_Insert
			@AppointmentTypeId
			,@ClientId
		        ,@Notes
		        ,@LocationsTableId
		        ,@AppointmentStart
		        ,@AppointmentEnd
		        ,@UserId
		   	,@Id OUTPUT

		
		

 
	COMMIT TRANSACTION;
	 SET @Id = SCOPE_IDENTITY()
	
END TRY
 
BEGIN CATCH
			
			IF @@TRANCOUNT > 0 ROLLBACK
				DECLARE @MSG nvarchar(2048) = ERROR_MESSAGE()
				RAISERROR (@MSG,16,1)
			ROLLBACK;
 
END CATCH



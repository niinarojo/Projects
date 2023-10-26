ALTER proc [dbo].[Messages_Insert]
		@Message nvarchar(1000)
		,@Subject nvarchar(100) = NULL
		,@RecipientId int
		,@SenderId int
		,@DateSent datetime2(7) = NULL
		,@DateRead datetime2(7) = NULL
		,@Id int OUTPUT

as

/*

DECLARE		@Id int = 0

DECLARE		@Message nvarchar(1000) = 'Dummy message!'
		,@Subject nvarchar(100) = 'Third Message'
		,@RecipientId int = 4
		,@SenderId int = 1
		,@DateSent datetime2(7) = '2023-10-23 10:30:20'
		,@DateRead datetime2(7) = '2023-10-23 11:30:00'

EXECUTE	[dbo].[Messages_Insert]
	    	@Message
	   	,@Subject
	   	,@RecipientId
	   	,@SenderId
	   	,@DateSent
	   	,@DateRead
		,@Id OUTPUT

*/

BEGIN

INSERT INTO [dbo].[Messages]
		([Message]
		,[Subject]
		,[RecipientId]
		,[SenderId]
		,[DateSent]
		,[DateRead])

     VALUES
	        (@Message
	        ,@Subject
	        ,@RecipientId
	        ,@SenderId
	        ,@DateSent
	        ,@DateRead)

     SET @Id = SCOPE_IDENTITY()
           
END

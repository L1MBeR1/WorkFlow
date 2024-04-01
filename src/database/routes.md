1. # POST
	1. # Получить все компоненты

		localhost:4000/database/components/all

	2. # Получить все функции

		localhost:4000/database/functions/all

	3. # Получить функции компонента по ID компонента

		localhost:4000/database/components/functions/by_component_id

		{
			"component_id": Integer
		}

	4. # Получить все сервисы

		-

	5. # Получить сервисы по ID компонента

		/database/services/by_component_id

		{
			"component_id": Integer
		}

	6. # component_function_parameter

		/database/components/functions/parameters/by_function_id

		{
			"function_id": Integer, 
			"is_return": Boolean
		}

	7. # Получить service_points

		/database/services/service_points/by_service_id

		{
			"service_id": Integer
		}

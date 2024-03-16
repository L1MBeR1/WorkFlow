1. # POST
	1. # Получить все компоненты

		localhost:4000/database/components/all

	2. # Получить функции компонента по ID компонента

		localhost:4000/database/components/functions/by_component_id

		{
			"component_id": Integer
		}

	3. # Получить все сервисы

		-

	4. # Получить сервисы по ID компонента

		/database/services/by_component_id

		{
			"component_id": Integer
		}

	5. # component_function_parameter

		/database/components/functions/parameters/by_function_id

		{
			"function_id": Integer, 
			"is_return": Boolean
		}

	6. # Получить service_points

		/database/services/service_points/by_service_id

		{
			"service_id": Integer
		}

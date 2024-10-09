echo Creating module $1
cd ./src/modules
mkdir $1
cd $1
touch index.ts
touch $1.controller.ts
touch $1.service.ts
touch $1.interfaces.ts
touch $1.validation.ts
touch $1.model.ts
touch $1.test.ts
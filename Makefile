# directories
base_dir		:= $(CURDIR)
build_dir		:= $(base_dir)/dist
node_modules	:= $(base_dir)/node_modules
node_bin		:= $(node_modules)/.bin
# source
js_source		:= $(base_dir)/src/maybe.js
# target
min_target		:= $(build_dir)/maybe.min.js
# node_modules executables
uglifyjs		:= $(node_bin)/uglifyjs

.PHONY: test

all : build-env
	@yarn
	@$(uglifyjs) $(js_source) > $(min_target)

build-env :
	@mkdir -p $(build_dir)

yarn-check :
ifeq ("$(wildcard $(node_bin))", "")
	@yarn
endif

test : yarn-check
	@yarn run test

clean :
	@rm -rf $(node_modules) $(build_dir)

.PHONY: test icons alfredworkflow clean

WORKFLOW := NATO.alfredworkflow

test:
	./test.sh

icons:
	scripts/icons.sh

alfredworkflow: test icons
	rm -f $(WORKFLOW)
	zip -qr $(WORKFLOW) info.plist nato.js icon.png icons

clean:
	rm -rf $(WORKFLOW) icons

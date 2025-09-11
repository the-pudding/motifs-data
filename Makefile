PHONY: github pudding copy-data

github:
	rm -rf docs
	cp -r build docs
	touch docs/.nojekyll
	git add -A
	git commit -m "update github pages"
	git push

protect:
	cd build && npx staticrypt --short index.html -p $(shell grep PASSWORD .env | cut -d '=' -f2) -d .

staging: 
	npm run build
	make github

production:
	npm run build
	make pudding

DATA_SRC    := static/data
TRACKS_SRC  := src/data
MOTIFS_DIR  := ../motifs/src/data/motifs
TRACKS_DIR  := ../motifs/src/data/tracks

copy-data:
	@mkdir -p "$(MOTIFS_DIR)" "$(TRACKS_DIR)"
	# Copy everything from static/data -> motifs/
	@cp -R "$(DATA_SRC)/." "$(MOTIFS_DIR)/"
	# Copy *-tracks.json from src/data -> tracks/ (safe if no matches)
	@for f in $(TRACKS_SRC)/*-tracks.json; do \
		[ -e "$$f" ] && cp "$$f" "$(TRACKS_DIR)/" || true; \
	done
	@echo "✓ Copied motifs to $(MOTIFS_DIR)"
	@echo "✓ Copied track JSONs to $(TRACKS_DIR)"

# aws-sync:
# 	aws s3 sync build s3://pudding.cool/year/month/name --delete --cache-control 'max-age=31536000'

# aws-cache:
# 	aws cloudfront create-invalidation --distribution-id E13X38CRR4E04D --paths '/year/month/name*'	

# pudding: aws-sync aws-cache
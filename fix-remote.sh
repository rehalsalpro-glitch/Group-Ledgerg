#!/bin/bash
git remote set-url origin https://github.com/rehalsalpro-glitch/Group-Ledger
echo "Remote fixed. New URL:"
git remote get-url origin
echo ""
echo "Pushing to GitHub..."
git push origin main
